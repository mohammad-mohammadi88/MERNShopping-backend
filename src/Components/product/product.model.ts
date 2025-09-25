import { model } from "mongoose";

import collections from "@/shared/collections.js";
import type IProduct from "./schema/product.d.js";
import productSchema from "./schema/product.js";

export default model<IProduct>(collections.product, productSchema);
