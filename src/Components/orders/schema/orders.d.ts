import type { Document, Types } from "mongoose";

import type IUserAddress from "@Users/schema/users.address";
import ordersStatus from "../orders.status.ts";
import type IOrderProduct from "./order.product.d.js";

export default interface IOrder extends Document {
    totalPrice: number;
    products: IOrderProduct[];
    finalPrice: number;
    coupon?: Types.ObjectId;
    userId: Types.ObjectId;
    deliveryAddress: IUserAddress;
    createdAt: Date;
    updatedAt: Date;
    status: (typeof ordersStatus)[keyof typeof ordersStatus];
}
