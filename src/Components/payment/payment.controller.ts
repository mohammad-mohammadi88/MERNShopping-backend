import { type RequestHandler, raw } from "express";

import { paymentStripe } from "@/services/index.js";
import { type FullOrderProduct, orderStore } from "../order/index.js";

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

    const calcPrice = (product: FullOrderProduct) =>
        product.product + (product?.color?.priceEffect || 0);

    const result = await paymentStripe.createPaymentSession(
        order.products.map((product) => {
            const {
                product: { thumbnail: image, title },
                count: quantity,
            } = product;
            const amount = calcPrice(product);
            return { quantity, amount, image, title };
        }),
        orderId
    );

    return res.status(result.ok ? 200 : 500).send(result.data);
};

// update payment status
const updatePaymentStatusCTRL: RequestHandler = async (req, res) => {
    const { data, ok } = paymentStripe.webhook(req);

    if (!ok) return res.status(500).send(data);
    if (data.type === "checkout.session.completed") {
        const session = data.data.object;
    }

    res.sendStatus(200);
};
export const updatePaymentStatusHandler: any[] = [
    raw({ type: "application/json" }),
    updatePaymentStatusCTRL,
];
