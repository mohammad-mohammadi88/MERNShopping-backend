import { model } from "mongoose";
import orderSchema from "../schema/orders.js";

const ProductOfferModel = model("Order", orderSchema);
export default ProductOfferModel;
