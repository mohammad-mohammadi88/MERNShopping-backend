import type { Document, Types } from "mongoose";

import type { IProduct } from "@Product/index.ts";
import type { OrderProductSchema } from "../order.validate.ts";

type IOrderProduct = Omit<
    OrderProductSchema,
    "count" | "productSalePrice" | "productPrice"
> &
    Document & {
        product: Types.ObjectId;
        count: number;
    };
export type FullOrderProduct = Omit<IOrderProduct, "product"> & {
    product: IProduct;
};
export default IOrderProduct;
