import type { Document } from "mongoose";
import type IProductAttr from "./products.attr";

export default interface ProductCategoryType extends Document {
    title: string;
    totalProducts: number;
    attrs: IProductAttr[];
}
