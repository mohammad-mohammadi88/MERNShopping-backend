import { Schema } from "mongoose";

import productAttrSchema from "./products.attr.js";
import type ProductType from "./products.d.js";
import productStatus from "../products.status.js";
import refrence from "@/contracts/refrence.js";

const statusType = {
    type: Number,
    enum: Object.values(productStatus),
    default: productStatus.INIT,
};
const productSchema: Schema<ProductType> = new Schema(
    {
        title: { type: String, required: true },
        thumbnail: { type: String, required: true },
        price: { type: Number, required: true },
        salePrice: { type: Number },
        gallery: { type: [String] },
        productCategory: refrence("ProductCategory"),
        attrs: [productAttrSchema],
        status: statusType,
    },
    { timestamps: true }
);
export default productSchema;
