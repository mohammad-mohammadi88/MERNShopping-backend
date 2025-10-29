import { model } from "mongoose";

import { collections } from "@Shared";
import { type IOrder, orderSchema } from "./schema/index.js";

export default model<IOrder>(collections.order, orderSchema);
