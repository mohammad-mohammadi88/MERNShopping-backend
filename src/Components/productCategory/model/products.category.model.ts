import { model } from "mongoose";
import productCategorySchema from "../schema/product.category.js";

const ProductCategoryModel = model("ProductCategory", productCategorySchema);
export default ProductCategoryModel;
