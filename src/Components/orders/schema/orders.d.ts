import type { Document, Types } from "mongoose";

import ordersStatus from "../orders.status.ts";
import type { PostOrderSchema } from "../orders.validate.ts";

type IOrder = PostOrderSchema &
    Document & {
        totalPrice: number;
        userId: Types.ObjectId;
        finalPrice: number;
        createdAt: Date;
        updatedAt: Date;
        status: (typeof ordersStatus)[keyof typeof ordersStatus];
    };
export default IOrder;
