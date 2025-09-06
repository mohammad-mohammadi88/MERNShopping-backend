import { Schema } from "mongoose";

import type ICoupon from "./coupon.d.js";
import couponStatus from "../coupon.status.js";

const statusType = {
    type: Number,
    required: true,
    enum: Object.values(couponStatus),
    default: couponStatus.ACTIVE,
};

const constraints = {
    user: Number,
};
const couponSchema: Schema<ICoupon> = new Schema({
    code: { type: String, required: true },
    amount: { type: Number, required: true },
    constraints,
    limit: { type: Number },
    used: { type: Number, default: 0 },
    expiresAt: { type: Date },
    status: statusType,
});

export default couponSchema;
