import { Schema } from "mongoose";

import refrence from "@/shared/refrence.js";
import productAttrSchema from "@P_Category/schema/product.attr.js";
import productStatus from "../products.status.js";
import type IProduct from "./products.d.js";

const statusType = {
    type: Number,
    enum: Object.values(productStatus),
    default: productStatus.INIT,
};
const productSchema: Schema<IProduct> = new Schema(
    {
        title: { type: String, required: true },
        thumbnail: { type: String, required: true },
        price: { type: Number, required: true },
        salePrice: { type: Number },
        gallery: { type: [String], default: [] },
        productCategory: refrence("ProductCategory"),
        attrs: [productAttrSchema],
        status: statusType,
    },
    { timestamps: true }
);
export default productSchema;
