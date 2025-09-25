import { model } from "mongoose";

import collections from "@/shared/collections.js";
import type ICoupon from "./schema/coupon.d.js";
import couponSchema from "./schema/coupon.js";

export default model<ICoupon>(collections.coupon, couponSchema);
