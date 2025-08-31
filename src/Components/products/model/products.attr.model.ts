import { model, Schema } from "mongoose";
import type ProductAttrType from "./products.attr.model.d.js";

const productAttrSchema: Schema = new Schema({
    title: { type: String, required: true },
    name: { type: String, required: true },
    filterable: { type: Boolean, default: false },
    isMultiple: { type: Boolean, default: false },
});

const ProductAttrModel = model<ProductAttrType>(
    "ProductAttr",
    productAttrSchema
);
export default ProductAttrModel;
