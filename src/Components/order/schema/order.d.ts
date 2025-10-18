import type { Document, Types } from "mongoose";

import type ICoupon from "@Coupon/schema/coupon.d.js";
import type { OrderStatusValue } from "../order.status.ts";
import type { PostOrderSchema } from "../order.validate.ts";
import type IOrderProduct from "./order.product.d.js";
import type { FullOrderProduct } from "./order.product.d.js";

type IOrder = Omit<PostOrderSchema, "products"> &
    Document & {
        totalPrice: number;
        products: IOrderProduct[];
        user: Types.ObjectId;
        finalPrice: number;
        createdAt: Date;
        updatedAt: Date;
        status: OrderStatusValue;
    };
export interface FullOrder extends Omit<IOrder, "couponCode" | "products"> {
    couponCode?: ICoupon;
    products: FullOrderProduct[];
}
export default IOrder;
