import { Document, Types } from "mongoose";

import couponStatus from "../coupon.status.js";
import type { Discount } from "../coupon.validate.ts";

export interface Constraints {
    user: Types.ObjectId;
}

export default interface ICoupon extends Document {
    code: string;
    discount: Discount;
    limit: number;
    used: number;
    expiresAt: Date;
    constraints: Constraints;
    status: (typeof couponStatus)[keyof typeof couponStatus];
}
