import { Schema } from "mongoose";
import type IProductAttr from "./product.attr.d.js";

const productAttrSchema: Schema<IProductAttr> = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
});

export default productAttrSchema;
