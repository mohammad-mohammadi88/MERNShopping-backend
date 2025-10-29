import { model } from "mongoose";

import { collections } from "@Shared";
import {
    productCategorySchema,
    type IProductCategory,
} from "./schema/index.js";

export default model<IProductCategory>(
    collections.productCategory,
    productCategorySchema
);
