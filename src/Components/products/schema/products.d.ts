import type { Document, Types } from "mongoose";

import productStatus from "../products.status.js";
import type IProductAttr from "./product.attr.d.js";
import type IProductColor from "./product.color.d.js";

export default interface IProduct extends Document {
    title: string;
    price: number;
    salePrice?: number;
    thumbnail: string;
    gallery?: string[];
    quantity: number;
    colors: IProductColor[];
    productCategory: Types.ObjectId;
    attrs: IProductAttr[];
    createdAt: Date;
    updatedAt: Date;
    status: (typeof productStatus)[keyof typeof productStatus];
}
