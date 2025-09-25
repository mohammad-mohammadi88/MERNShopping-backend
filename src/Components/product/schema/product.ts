import { Schema } from "mongoose";

import { reference, statusSchema } from "@/shared/index.js";
import productStatus from "../product.status.js";
import productAttrSchema from "./product.attr.js";
import productColorSchema from "./product.color.js";
import type IProduct from "./product.d.js";

const productSchema: Schema<IProduct> = new Schema(
    {
        title: { type: String, required: true },
        thumbnail: { type: String, required: true },
        price: { type: Number, required: true },
        salePrice: { type: Number },
        colors: { type: [productColorSchema], default: [] },
        gallery: { type: [String], default: [] },
        quantity: { type: Number, default: 0 },
        productCategory: reference("ProductCategory"),
        attrs: { type: [productAttrSchema], default: [] },
        status: statusSchema(productStatus),
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
