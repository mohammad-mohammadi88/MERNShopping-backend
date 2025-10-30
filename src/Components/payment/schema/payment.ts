import { Schema, type ObjectId } from "mongoose";

import { orderStore } from "@Order/index.js";
import { reference, statusSchema } from "@Shared";
import type { IUser } from "@User/index.js";
import paymentStatus from "../payment.status.js";
import type IPayment from "./payment.d.js";

export interface FullPayment extends Omit<IPayment, "user"> {
    user: IUser;
}

export { type IPayment };
const paymentSchema = new Schema<IPayment>(
    {
        amount: { type: Number, required: true },
        order: reference("Order"),
        stripeSessionId: { type: String, required: true },
        paymentId: { type: String, required: false },
        currency: { type: String, required: true },
        paidAmount: { type: Number, required: false },
        status: statusSchema(paymentStatus),
        user: reference("User"),
    },
    { timestamps: true }
);
paymentSchema.pre("validate", async function () {
    const { data: order, error } = await orderStore.getOrder(
        this.order as unknown as string
    );
    if (error || !order) throw error;

    this.amount = order.finalPrice;
    this.user = (order.user._id as ObjectId).toString() as any;
});

export default paymentSchema;
