import type { Document, Types } from "mongoose";

import type { OrderProductSchema } from "../order.validate.ts";

type IOrderProduct = Omit<
    OrderProductSchema,
    "count" | "productSalePrice" | "productPrice"
> &
    Document & {
        productID: Types.ObjectId;
        count: number;
    };
export default IOrderProduct;
