import { Schema } from "mongoose";

import refrence from "@/shared/reference.js";
import statusSchema from "@/shared/statusSchema.js";
import ordersStore from "@Order/order.store.js";
import paymentStatus from "../payment.status.js";
import type IPayment from "./payment.d.js";

const paymentSchema = new Schema<IPayment>(
    {
        amount: { type: Number },
        isOnline: { type: Boolean, default: true },
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
    this.user = order.user;
});

export default paymentSchema;
