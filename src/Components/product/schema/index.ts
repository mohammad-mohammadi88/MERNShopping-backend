import type { IComment } from "@Comment/index.js";
import type IProductAttr from "./product.attr.d.js";
import productAttrSchema from "./product.attr.js";
import type IProductColor from "./product.color.d.js";
import productColorSchema from "./product.color.js";
import type IProduct from "./product.d.js";
import productSchema from "./product.js";

export interface FullProduct extends IProduct {
    comments: IComment[];
}
export {
    productAttrSchema,
    productColorSchema,
    productSchema,
    type IProduct,
    type IProductAttr,
    type IProductColor,
};
