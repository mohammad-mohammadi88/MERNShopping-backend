import type { Document, Types } from "mongoose";

import type IProductAttr from "@P_Category/schema/product.attr.d.js";
import productStatus from "../products.status.js";

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
