import defaults from "@/shared/defaults.js";
import Stripe from "stripe";

const {
    frontend: { cancel_url, success_url },
    stripeSecretKey,
} = defaults;
const stripe = new Stripe(stripeSecretKey);
interface CreateSessionProduct {
    title: string;
    amount: number;
    quantity: number;
    image: string;
}
const createPaymentSession = async (products: CreateSessionProduct[]) => {
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
        products.map(({ amount, quantity, title: name, image }) => ({
            price_data: {
                currency: "usd",
                product_data: { name, images: [image] },
                unit_amount: amount * 100,
            },
            quantity,
        }));
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items,
        success_url,
        cancel_url,
    });
    return session;
};

const checkPaymentStatus = async (session_id: string) =>
    await stripe.checkout.sessions.retrieve(session_id);

export default { createPaymentSession, checkPaymentStatus };
