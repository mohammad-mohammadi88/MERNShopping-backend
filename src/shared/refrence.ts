import { Schema } from "mongoose";

export type Collections =
    | "User"
    | "Product"
    | "Coupon"
    | "Order"
    | "ProductCategory"
    | "ProductOffer";

export default (ref: Collections, required = true, options?: object) => ({
    type: Schema.Types.ObjectId,
    required,
    ref,
    ...options,
});
