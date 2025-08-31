import { Schema } from "mongoose";

import ordersStatus from "../orders.status.js";
import type OrderType from "./orders.d.js";
import refrence from "@/contracts/refrence.js";

const couponType = {
    type: {
        percent: { type: Number },
        code: { type: String },
    },
    default: null,
};
const statusType = {
    type: Number,
    required: true,
    enum: Object.values(ordersStatus),
    default: ordersStatus.PENDING,
};
const orderSchema: Schema<OrderType> = new Schema(
    {
        finalPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        coupon: couponType,
        userId: refrence("User"),
        status: statusType,
    },
    { timestamps: true }
);
export default orderSchema;
