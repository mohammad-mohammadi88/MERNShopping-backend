import type { Document, Types } from "mongoose";

import type { ICoupon } from "@Coupon/index.js";
import type { IPayment } from "@Payment/index.js";
import type {
    FullOrderProduct,
    IOrderProduct,
    OrderStatusValue,
    PostOrderSchema,
} from "../index.js";

type IOrder = Omit<PostOrderSchema, "products"> &
    Document & {
        totalPrice: number;
        products: IOrderProduct[];
        user: Types.ObjectId;
        finalPrice: number;
        createdAt: Date;
        updatedAt: Date;
        payment?: Types.ObjectId;
        status: OrderStatusValue;
    };
export interface FullOrder extends Omit<IOrder, "couponCode" | "products"> {
    couponCode?: ICoupon;
    products: FullOrderProduct[];
    payment?: IPayment;
}
export default IOrder;
