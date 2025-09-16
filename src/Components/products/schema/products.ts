import { Schema } from "mongoose";

import refrence from "@/shared/refrence.js";
import productStatus from "../products.status.js";
import productAttrSchema from "./product.attr.js";
import productColorSchema from "./product.color.js";
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
        colors: { type: [productColorSchema], default: [] },
        gallery: { type: [String], default: [] },
        quantity: { type: Number, default: 0 },
        productCategory: refrence("ProductCategory"),
        attrs: { type: [productAttrSchema], default: [] },
        status: statusType,
    },
    { timestamps: true }
).pre(
    "save",
    // to initialize salePrice as price if it is not defined
    function (next) {
        if (!this.salePrice) this.salePrice = this.price;
        return next();
    }
);

export default productSchema;
