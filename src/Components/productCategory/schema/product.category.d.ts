import type { Document } from "mongoose";

export default interface IProductCategory extends Document {
    title: string;
    totalProducts: number;
    attrs: IProductAttr[];
}
