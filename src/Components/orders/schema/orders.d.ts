import type { Document, Types } from "mongoose";

import ordersStatus from "../orders.status.ts";
import type IUserAddress from "@Users/schema/users.address";

export default interface IOrder extends Document {
    totalPrice: number;
    products: Types.ObjectId[];
    finalPrice: number;
    coupon: Types.ObjectId;
    userId: Types.ObjectId;
    deliveryAddress: IUserAddress;
    createdAt: Date;
    updatedAt: Date;
    status: (typeof ordersStatus)[keyof typeof ordersStatus];
}
