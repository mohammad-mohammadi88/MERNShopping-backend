import { type RequestHandler, raw } from "express";
import type { ObjectId } from "mongoose";
import type Stripe from "stripe";

import { paymentStripe } from "@/services/index.js";
import {
    type FullOrderProduct,
    ordersStatus,
    orderStore,
} from "@Order/index.js";
import {
    type GetDataWithPagination,
    type IQuery,
    type Pagination,
    type Status,
    paginationHandler,
} from "@Shared";
import {
    type IPayment,
    type NewPaymentData,
    type UpdatePaymentData,
    paymentStatus,
    paymentStore,
} from "./index.js";

// create payment session
export const createSessionHandler: RequestHandler<
    null,
    string,
    { orderId: string }
> = async (req, res) => {
    const orderId = req.body.orderId;
    const {
        status: orderStatus,
        data: order,
        error: orderError,
    } = await orderStore.getOrderWithCoupon(orderId);
    if (orderError || !order) return res.status(orderStatus).send(orderError);

    // don't allow repaying
    if (order.status !== ordersStatus.INIT)
        return res.status(400).send("This order is already paid");

    const calcPrice = (product: FullOrderProduct) =>
        product.product.salePrice + (product?.color?.priceEffect || 0);
    const { data: session, ok } = await paymentStripe.createPaymentSession(
        order.products.map((product) => {
            const {
                product: { thumbnail: image, title },
                count: quantity,
            } = product;
            const amount = calcPrice(product);
            return { quantity, amount, image, title };
        }),
        orderId,
        order?.couponCode
    );
    if (!ok) return res.status(500).send(session);

    // save new initial payment in database
    const newPayment: NewPaymentData = {
        order: orderId,
        amount: session.amount_total
            ? session.amount_total / 100
            : order.finalPrice,
        currency: session.currency || "usd",
        stripeSessionId: session.id,
    };
    // add new payment to database
    const {
        status: paymentStatus,
        error: paymentError,
        data: payment,
    } = await paymentStore.addNewPayment(newPayment);
    if (paymentError) return res.status(paymentStatus).send(paymentError);

    // connect new payment to the order
    const { status, error } = await orderStore.addPaymentId(
        orderId,
        (payment?._id as ObjectId).toString()
    );
    if (error) return res.status(status).send(error);

    return res.status(201).send(session.url!);
};

// update payment status
const handleSuccess = async (event: Stripe.Event) => {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.client_reference_id!;
    if (orderId?.length !== 24) return;

    const paymentInfo = await paymentStripe.getPaymentInfo(session);
    // @ts-ignore
    const updatePaymentInfo: UpdatePaymentData = {
        ...paymentInfo,
        status: paymentStatus.SUCCESS,
    };
    await orderStore.editOrderStatus(orderId, ordersStatus.PAID);
    await paymentStore.updatePayment(orderId, updatePaymentInfo);
};
const handleFail = async (orderId: string) =>
    orderId &&
    (await paymentStore.updatePayment(orderId, {
        status: paymentStatus.FAILED,
    }));

const updatePaymentStatusCTRL: RequestHandler = async (req, res) => {
    const { data: event, ok } = paymentStripe.webhook(req);

    if (!ok) return res.status(500).send(event);
    if (event.type === "checkout.session.completed") await handleSuccess(event);
    else if (
        event.type === "payment_intent.canceled" ||
        event.type === "payment_intent.payment_failed"
    )
        // @ts-ignore
        await handleFail(event.data.object?.client_reference_id);

    res.sendStatus(200);
};
export const updatePaymentStatusHandler: any[] = [
    raw({ type: "application/json" }),
    updatePaymentStatusCTRL,
];

// get all payments
export const getAllPaymentsHandler: RequestHandler<
    null,
    string | GetDataWithPagination<IPayment>,
    null,
    Status & Pagination & IQuery
> = async (req, res) => {
    const reqStatus = req.query.status;
    const query = req.query.query || "";

    const pagination = paginationHandler(req);
    const { status, data, error } = await paymentStore.getAllPayments({
        status: reqStatus ? Number(reqStatus) : undefined,
        query,
        pagination,
    });
    return res.status(status).send(data || error);
};

// get single payment
export const getSinglePaymentHandler: RequestHandler<
    { id: string },
    string | IPayment
> = async (req, res) => {
    const { status, data, error } = await paymentStore.getSinglePayment(
        req.params.id
    );
    if (error || !data) return res.status(status).send(error);

    if (!req.user.isAdmin && data.user.toString() !== req.user.id)
        return res.status(401).send("You cannot access others payment info");

    return res.status(200).send(data);
};
