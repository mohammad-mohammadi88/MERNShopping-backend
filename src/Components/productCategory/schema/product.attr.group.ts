import { Schema } from "mongoose";

import type IProductAttrGroup from "./product.attr.group.d.js";

const productAttrGroupSchema: Schema<IProductAttrGroup> = new Schema({
    title: { type: String, required: true },
    attrs: [String],
});

export default productAttrGroupSchema;
