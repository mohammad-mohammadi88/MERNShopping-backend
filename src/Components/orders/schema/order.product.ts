import { Schema } from "mongoose";

import refrence from "@/shared/refrence.js";
import productColorSchema from "@Products/schema/product.color.js";
import type IOrderProduct from "./order.product.d.js";

const orderProductSchema: Schema<IOrderProduct> = new Schema({
    productID: refrence("Product"),
    color: { type: productColorSchema, required: false },
    count: { type: Number, default: 1 },
});
export default orderProductSchema;
