import { Schema } from "mongoose";

import refrence from "@/shared/refrence.js";
import couponStatus from "../coupon.status.js";
import type ICoupon from "./coupon.d.js";

const DiscountSchema = new Schema(
    {
        role: { type: String, enum: ["number", "percent"], required: true },
        amount: {
            type: Number,
            required: true,
            validate: {
                validator: function (this: { role: string; amount: number }) {
                    if (this.role === "percent") {
                        return this.amount >= 0 && this.amount <= 100;
                    }
                    if (this.role === "number") {
                        return this.amount >= 0;
                    }
                    return false;
                },
                message: ({ value }: { value: number }) =>
                    `Invalid discount amount: ${value}. For "percent" must be 0–100, for "number" must be ≥ 0.`,
            },
        },
    },
    { _id: false }
);

const ConstraintsSchema = new Schema(
    { user: refrence("User") },
    { _id: false }
);

const statusType = {
    type: Number,
    enum: Object.values(couponStatus),
    default: couponStatus.ACTIVE,
};
const CouponSchema = new Schema<ICoupon>(
    {
        code: { type: String, required: true, unique: true },
        discount: { type: DiscountSchema, required: true },
        limit: { type: Number, required: true },
        used: { type: Number, required: true, default: 0 },
        constraints: { type: ConstraintsSchema, required: true },
        status: statusType,
        expiresAt: {
            type: Date,
            required: true,
            validate: {
                validator: function (this: { expiresAt: Date }) {
                    const expireDate = new Date(this.expiresAt).getTime();
                    const now = new Date(Date.now()).getTime();
                    if (now < expireDate) return true;
                    return false;
                },
                message: ({ value }) =>
                    `${new Date(
                        value
                    ).toISOString()} is passed and cannot be used ad expiresAt`,
            },
        },
    },
    { timestamps: true }
);

export default CouponSchema;
