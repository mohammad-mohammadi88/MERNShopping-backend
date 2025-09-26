import { Schema } from "mongoose";

import reference from "@/shared/reference.js";
import productColorSchema from "@Product/schema/product.color.js";
import type IOrderProduct from "./order.product.d.js";

const orderProductSchema: Schema<IOrderProduct> = new Schema({
    product: reference("Product"),
    color: { type: productColorSchema, required: false },
    count: { type: Number, default: 1 },
});
export default orderProductSchema;
