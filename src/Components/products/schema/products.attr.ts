import { Schema } from "mongoose";

import type IProductAttr from "./products.attr.d.js";

const productAttrSchema: Schema<IProductAttr> = new Schema({
    title: { type: String, required: true },
    name: { type: String, required: true },
    filterable: { type: Boolean, default: false },
    isMultiple: { type: Boolean, default: false },
});

export default productAttrSchema;
