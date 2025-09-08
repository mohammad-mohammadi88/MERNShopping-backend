import { Schema } from "mongoose";

import productAttrGroupSchema from "./product.attr.group.js";
import type IProductCategory from "./product.category.d.js";

const productCategorySchema: Schema<IProductCategory> = new Schema({
    title: { type: String, required: true },
    totalProducts: { type: Number, default: 0 },
    attrs: [productAttrGroupSchema],
});
export default productCategorySchema;
