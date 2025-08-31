import { model, Schema } from "mongoose";

import type ProductType from "./products.model.d.js";
import productStatus from "../products.status.js";
import ProductAttrModel from "./products.attr.model.js";

const productSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        thumbnail: { type: String, required: true },
        price: { type: Number, required: true },
        salePrice: { type: Number },
        gallery: { type: [String] },
        productCategory: {
            type: Schema.Types.ObjectId,
            ref: "ProductCategory",
        },
        attrs: [ProductAttrModel.schema],
        status: { type: productStatus, default: productStatus.INIT },
    },
    { timestamps: true }
);

const ProductModel = model<ProductType>("Product", productSchema);
export default ProductModel;
