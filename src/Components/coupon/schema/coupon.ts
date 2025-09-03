import { Schema } from "mongoose";

import type CouponType from "./coupon.d.js";
import couponStatus from "../coupon.status.js";

const statusType = {
    type: Number,
    required: true,
    enum: Object.values(couponStatus),
    default: couponStatus.ACTIVE,
};

const couponSchema: Schema<CouponType> = new Schema({
    code: { type: String, required: true },
    amount: { type: Number, required: true },
    constraints: { type: Object },
    limit: { type: Number },
    used: { type: Number, default: 0 },
    expiresAt: { type: Date },
    status: statusType,
});

export default couponSchema;
