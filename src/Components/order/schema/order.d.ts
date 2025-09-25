import type { Document, Types } from "mongoose";

import type { OrderStatusValue } from "../order.status.ts";
import type { PostOrderSchema } from "../order.validate.ts";
import type IOrderProduct from "./order.product.d.js";

type IOrder = Omit<PostOrderSchema, "products"> &
    Document & {
        totalPrice: number;
        products: IOrderProduct[];
        userId: Types.ObjectId;
        finalPrice: number;
        createdAt: Date;
        updatedAt: Date;
        status: OrderStatusValue;
    };
export default IOrder;
