import ordersStore from "@/Components/order/order.store.js";
import refrence from "@/shared/reference.js";
import statusSchema from "@/shared/statusSchema.js";
import { Schema } from "mongoose";
import paymentStatus from "../payment.status.js";
import type IPayment from "./payment.d.js";

const paymentSchema = new Schema<IPayment>(
    {
        amount: { type: Number },
        method: { type: String, required: true },
        order: refrence("Order"),
        reference: { type: String, required: true },
        reserve: { type: String, required: true },
        status: statusSchema(paymentStatus),
        user: refrence("User"),
    },
    { timestamps: true }
);
paymentSchema.pre("validate", async function () {
    const { data: order, error } = await ordersStore.getOrder(
        this.order as unknown as string
    );
    if (error || !order) throw error;

    this.amount = order.finalPrice;
    this.user = order.userId;
});

export default paymentSchema;
