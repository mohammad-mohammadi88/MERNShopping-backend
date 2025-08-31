import type { Document } from "mongoose";
import productStatus from "../products.status";
import type ProductAttrType from "./products.attr.model.d.js";

export default interface ProductType extends Document {
    title: string;
    price: number;
    salePrice: number;
    thumbnail: string;
    gallery?: string[];
    productCategory: string;
    attrs: ProductAttrType[];
    createdAt: Date;
    updatedAt: Date;
    status: (typeof productStatus)[keyof typeof productStatus];
}
