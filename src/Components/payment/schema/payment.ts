import { Schema } from "mongoose";

import { reference, statusSchema } from "@/shared/index.js";
import ordersStore from "@Order/order.store.js";
import paymentStatus from "../payment.status.js";
import type IPayment from "./payment.d.js";

export { type IPayment };
const paymentSchema = new Schema<IPayment>(
    {
        amount: { type: Number },
        order: reference("Order"),
        stripeSessionId: { type: String, required: true },
        currency: { type: String, required: true },
        status: statusSchema(paymentStatus),
        user: reference("User"),
    },
    { timestamps: true }
);
paymentSchema.pre("validate", async function () {
    const { data: order, error } = await ordersStore.getOrder(
        this.order as unknown as string
    );
    if (error || !order) throw error;

    this.amount = order.finalPrice;
    this.user = order.user;
});

export default paymentSchema;
