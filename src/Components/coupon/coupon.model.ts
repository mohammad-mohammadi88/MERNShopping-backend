import { model } from "mongoose";
import type ICoupon from "./schema/coupon.d.js";
import couponSchema from "./schema/coupon.js";

export default model<ICoupon>("Coupon", couponSchema);
