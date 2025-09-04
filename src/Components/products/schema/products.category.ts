import { Schema } from "mongoose";

import type IProductCategory from "./products.category.d.js";
import productAttrSchema from "../schema/products.attr.js";

const productCategorySchema: Schema<IProductCategory> = new Schema({
    title: { type: String, required: true },
    totalProducts: { type: Number, default: 0 },
    attrs: [productAttrSchema],
});
export default productCategorySchema;
