import { model } from "mongoose";
import type IOrder from "./schema/order.d.js";
import orderSchema from "./schema/order.js";

export default model<IOrder>("Order", orderSchema);
