import type { Document } from "mongoose";

import type IProductAttr from "./product.attr.d.js";

export default interface IProductAttrGroup extends Document {
    title: string;
    attrs: IProductAttr[];
}
