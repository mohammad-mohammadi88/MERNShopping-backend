import { model } from "mongoose";

import { collections } from "@Shared";
import { productSchema, type IProduct } from "./schema/index.js";

export default model<IProduct>(collections.product, productSchema);
