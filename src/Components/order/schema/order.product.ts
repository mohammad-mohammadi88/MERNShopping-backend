import { Schema } from "mongoose";

import { productColorSchema } from "@Product/index.js";
import { reference } from "@Shared";
import type IOrderProduct from "./order.product.d.js";

const orderProductSchema: Schema<IOrderProduct> = new Schema({
    product: reference("Product"),
    color: { type: productColorSchema, required: false },
    count: { type: Number, default: 1 },
});
export default orderProductSchema;
