import { Document, Types } from "mongoose";

import type { CouponStatusValue } from "../coupon.status.js";
import type { Discount } from "../coupon.validate.js";

export default interface ICoupon extends Document {
    code: string;
    discount: Discount;
    limit: number;
    used: number;
    expiresAt: Date;
    user: Types.ObjectId;
    status: CouponStatusValue;
}
