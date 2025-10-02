import { Schema } from "mongoose";

import { errorHandler, reference, statusSchema } from "@/shared/index.js";
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
    { user: reference("User") },
    { _id: false }
);

const CouponSchema = new Schema<ICoupon>(
    {
        code: { type: String, required: true, unique: true },
        discount: { type: DiscountSchema, required: true },
        limit: { type: Number, required: true },
        used: { type: Number, required: true, default: 0 },
        constraints: { type: ConstraintsSchema, required: true },
        status: statusSchema(couponStatus),
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
CouponSchema.pre("findOneAndUpdate", async function (next) {
    const coupon: ICoupon | null = await this.model.findOne(this.getQuery());

    if (!coupon) return next(new Error("Coupon with this code not found"));

    const updateParams: any = this.getUpdate();
    const changeValue = updateParams?.$inc?.used;

    if (!updateParams.$inc || typeof changeValue !== "number") return next();

    const { used, limit, status, _id } = coupon;

    if (used + changeValue !== limit && status !== couponStatus.INACTIVE)
        return next();

    const newStatus =
        status === couponStatus.ACTIVE
            ? couponStatus.INACTIVE
            : couponStatus.ACTIVE;

    const { error } = await errorHandler(
        () => this.model.findByIdAndUpdate(_id, { status: newStatus }),
        "updating coupon status",
        { notFoundError: `Coupon with id #${_id}` }
    );
    return next(error ? new Error(error) : undefined);
});

export default CouponSchema;
