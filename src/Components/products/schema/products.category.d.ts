import type { Document } from "mongoose";
import type ProductAttrType from "./products.attr";

export default interface ProductCategoryType extends Document {
    title: string;
    totalProducts: number;
    attrs: ProductAttrType[];
}
