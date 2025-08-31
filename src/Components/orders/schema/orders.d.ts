import type { Document, Types } from "mongoose";
import ordersStatus from "../orders.status.ts";

interface Coupon {
    percent: number;
    code: string;
}
export default interface OrderType extends Document {
    totalPrice: number;
    products: Types.ObjectId[];
    finalPrice: number;
    coupon: Coupon;
    userId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    status: (typeof ordersStatus)[keyof typeof ordersStatus];
}
