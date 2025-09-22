import { model } from "mongoose";
import orderSchema from "../schema/orders.js";

const OrderModel = model("Order", orderSchema);
export default OrderModel;
