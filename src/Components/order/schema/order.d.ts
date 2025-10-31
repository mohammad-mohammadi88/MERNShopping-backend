import type { Document, Types } from "mongoose";

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
        shipment?: Types.ObjectId;
        finalPrice: number;
        createdAt: Date;
        updatedAt: Date;
        payment?: Types.ObjectId;
        status: OrderStatusValue;
    };
export interface FullOrder extends Omit<IOrder, "products"> {
    products: FullOrderProduct[];
}
export default IOrder;
