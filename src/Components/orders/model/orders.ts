import { model } from "mongoose";
import orderSchema from "../schema/orders.js";

const ProductModel = model("Order", orderSchema);
export default ProductModel;
