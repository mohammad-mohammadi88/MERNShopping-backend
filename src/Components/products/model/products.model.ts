import { model } from "mongoose";
import productSchema from "../schema/products.js";

const ProductModel = model("Product", productSchema);
export default ProductModel;
