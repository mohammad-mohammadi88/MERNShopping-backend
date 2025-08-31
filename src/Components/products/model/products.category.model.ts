import { model } from "mongoose";
import productCategorySchema from "../schema/products.category.js";

const ProductCategoryModel = model("ProductCategory", productCategorySchema);
export default ProductCategoryModel;
