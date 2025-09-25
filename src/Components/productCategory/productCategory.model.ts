import { model } from "mongoose";
import type IProductCategory from "./schema/productCategory.d.js";
import productCategorySchema from "./schema/productCategory.js";

export default model<IProductCategory>(
    "ProductCategory",
    productCategorySchema
);
