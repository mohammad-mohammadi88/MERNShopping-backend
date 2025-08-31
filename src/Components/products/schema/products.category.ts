import { Schema } from "mongoose";

import type ProductCategoryType from "./products.category.d.js";
import productAttrSchema from "../schema/products.attr.js";

const productCategorySchema: Schema<ProductCategoryType> = new Schema({
    title: { type: String, required: true },
    totalProducts: { type: Number, default: 0 },
    attrs: [productAttrSchema],
});
export default productCategorySchema;
