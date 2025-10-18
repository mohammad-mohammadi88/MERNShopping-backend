import type { Request } from "express";
import Stripe from "stripe";

import defaults from "@/shared/defaults.js";

const {
    frontend: { cancel_url, success_url },
    stripe: { stripeSecretKey, stripeWebhookSecret },
} = defaults;
const stripe = new Stripe(stripeSecretKey);
interface CreateSessionProduct {
    title: string;
    amount: number;
    quantity: number;
    image: string;
}
type Response<T> = { ok: false; data: string } | { ok: true; data: T };
const createPaymentSession = async (
    products: CreateSessionProduct[],
    orderId: string
): Promise<Response<string>> => {
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
        products.map(({ amount, quantity, title: name, image }) => ({
            price_data: {
                currency: "usd",
                product_data: { name, images: [image] },
                unit_amount: amount * 100,
            },
            quantity,
        }));
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items,
            success_url,
            cancel_url,
            metadata: { orderId },
        });
        return { ok: true, data: session.url! };
    } catch (e) {
        return { ok: false, data: (e as Error).message };
    }
};

const checkPaymentStatus = async (session_id: string) =>
    await stripe.checkout.sessions.retrieve(session_id);

const webhook = (req: Request): Response<Stripe.Event> => {
    try {
        const sig = req.headers["stripe-signature"]!;
        const data = stripe.webhooks.constructEvent(
            req.body,
            sig,
            stripeWebhookSecret
        );
        return { ok: true, data };
    } catch (e) {
        const error = (e as Error).message;
        console.log("⚠️ Webhook signature verification failed:", error);
        return { ok: false, data: error };
    }
};

export default { createPaymentSession, checkPaymentStatus, webhook };
