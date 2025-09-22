import type { Document, Types } from "mongoose";

import ordersStatus from "../orders.status.js";
import type { PostOrderSchema } from "../orders.validate.js";
import type IOrderProduct from "./order.product.d.js";

type IOrder = Omit<PostOrderSchema, "products"> &
    Document & {
        totalPrice: number;
        products: IOrderProduct[];
        userId: Types.ObjectId;
        finalPrice: number;
        createdAt: Date;
        updatedAt: Date;
        status: (typeof ordersStatus)[keyof typeof ordersStatus];
    };
export default IOrder;
