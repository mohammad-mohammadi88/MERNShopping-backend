import type { Document, Types } from "mongoose";

import type IProductColor from "@Products/schema/product.color.d.js";

export default interface IOrderProduct extends Document {
    color?: null | IProductColor;
    productID: Types.ObjectId;
    count: number;
}
