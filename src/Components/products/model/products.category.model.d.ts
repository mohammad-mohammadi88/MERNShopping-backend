import type { Document } from "mongoose";
import type ProductAttrType from "./products.attr.model.d.js";

export default interface ProductCategoryType extends Document {
    title: string;
    totalProducts: number;
    attrs: ProductAttrType[];
}
