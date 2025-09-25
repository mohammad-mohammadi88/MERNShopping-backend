import { model } from "mongoose";

import collections from "@/shared/collections.js";
import type IProductCategory from "./schema/productCategory.d.js";
import productCategorySchema from "./schema/productCategory.js";

export default model<IProductCategory>(
    collections.productCategory,
    productCategorySchema
);
