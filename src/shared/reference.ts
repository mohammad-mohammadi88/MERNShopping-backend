import { Schema } from "mongoose";

export type Collections =
    | "Coupon"
    | "Order"
    | "Payment"
    | "Product"
    | "ProductCategory"
    | "ProductOffer"
    | "User"
    | "Comment";

export default (ref: Collections, required = true, options?: object) => ({
    type: Schema.Types.ObjectId,
    required,
    ref,
    ...options,
});
