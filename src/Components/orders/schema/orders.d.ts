import type { Document, Types } from "mongoose";

import ordersStatus from "../orders.status.ts";
import type UserAddressType from "@Users/schema/users.address";

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
    deliveryAddress: UserAddressType;
    createdAt: Date;
    updatedAt: Date;
    status: (typeof ordersStatus)[keyof typeof ordersStatus];
}
