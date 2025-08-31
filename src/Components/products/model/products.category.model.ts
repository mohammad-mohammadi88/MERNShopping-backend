import { model, Schema } from "mongoose";

import type ProductCategoryType from "./products.category.model.d.js";
import ProductAttrModel from "./products.attr.model.js";

const productCategorySchema: Schema<ProductCategoryType> = new Schema({
    title: { type: String, required: true },
    totalProducts: { type: Number, default: 0 },
    attrs: [ProductAttrModel.schema],
});

const ProductCategoryModel = model("ProductCategory", productCategorySchema);
export default ProductCategoryModel;
