import { model } from "mongoose";

import collections from "@/shared/collections.js";
import type IOrder from "./schema/order.d.js";
import orderSchema from "./schema/order.js";

export default model<IOrder>(collections.order, orderSchema);
