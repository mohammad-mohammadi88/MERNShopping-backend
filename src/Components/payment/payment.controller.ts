import { type RequestHandler, raw } from "express";

import { paymentStripe } from "@/services/index.js";
import type Stripe from "stripe";
import {
    type FullOrderProduct,
    ordersStatus,
    orderStore,
} from "../order/index.js";
import paymentStatus from "./payment.status.js";
import paymentStore, {
    type NewPaymentData,
    type UpdatePaymentData,
} from "./payment.store.js";

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
    } = await orderStore.getOrder(orderId);
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
        order.couponCode
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
    const { status, error } = await paymentStore.addNewPayment(newPayment);
    if (error) return res.status(status).send(error);

    return res.status(201).send(session.url!);
};

// update payment status
const handleSuccess = async (event: Stripe.Event) => {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.client_reference_id!;
    const paymentInfo = await paymentStripe.getPaymentInfo(session);
    // @ts-ignore
    const updatePaymentInfo: UpdatePaymentData = {
        ...paymentInfo,
        status: paymentStatus.SUCCESS,
    };
    await paymentStore.updatePayment(orderId, updatePaymentInfo);
};
const handleFail = (orderId: string) =>
    paymentStore.updatePayment(orderId, { status: paymentStatus.FAILED });

const updatePaymentStatusCTRL: RequestHandler = async (req, res) => {
    const { data: event, ok } = paymentStripe.webhook(req);
    console.dir(event, { depth: null });

    if (!ok) return res.status(500).send(event);
    switch (event.type) {
        case "checkout.session.completed":
            await handleSuccess(event);
        case "payment_intent.canceled":
        case "payment_intent.payment_failed":
            await handleFail(event.data.object?.id!);
        default:
            break;
    }

    res.sendStatus(200);
};
export const updatePaymentStatusHandler: any[] = [
    raw({ type: "application/json" }),
    updatePaymentStatusCTRL,
];
