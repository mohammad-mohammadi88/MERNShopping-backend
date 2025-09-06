import type { Document, Types } from "mongoose";

import productStatus from "../products.status";
import type IProductAttr from "./products.attr.schema";

export default interface IProduct extends Document {
    title: string;
    price: number;
    salePrice: number;
    thumbnail: string;
    gallery?: string[];
    productCategory: Types.ObjectId;
    attrs: IProductAttr[];
    createdAt: Date;
    updatedAt: Date;
    status: (typeof productStatus)[keyof typeof productStatus];
}
