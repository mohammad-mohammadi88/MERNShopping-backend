import { type IProductAttr } from "@Product/schema/index.js";
import type { Document } from "mongoose";

export default interface IProductCategory extends Document {
    title: string;
    totalProducts: number;
    attrGroups: IProductAttr[];
}
