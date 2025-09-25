import { model } from "mongoose";
import type IProduct from "./schema/product.d.js";
import productSchema from "./schema/product.js";

export default model<IProduct>("Product", productSchema);
