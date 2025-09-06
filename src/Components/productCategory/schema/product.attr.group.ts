import { Schema } from "mongoose";

import type IProductAttrGroup from "./product.attr.group.d.js";
import productAttrSchema from "./product.attr.js";

const productAttrGroupSchema: Schema<IProductAttrGroup> = new Schema({
    title: { type: String, required: true },
    attrs: [productAttrSchema],
});

export default productAttrGroupSchema;
