import { Document } from "mongoose";
import couponStatus from "../coupon.status";

export default interface CouponType extends Document {
    code: string;
    amount: number;
    limit: number;
    used: number;
    expiresAt: Date;
    constraints: object;
    status: (typeof couponStatus)[keyof typeof couponStatus];
}
