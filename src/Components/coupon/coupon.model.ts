import { model } from "mongoose";

import { collections } from "@Shared";
import couponSchema, { type ICoupon } from "./schema/coupon.js";

export default model<ICoupon>(collections.coupon, couponSchema);
