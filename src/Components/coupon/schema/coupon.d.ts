import { Document, Types } from "mongoose";
import couponStatus from "../coupon.status";

interface Constraints {
    user: Types.ObjectId;
}
export default interface ICoupon extends Document {
    code: string;
    amount: number;
    limit: number;
    used: number;
    expiresAt: Date;
    constraints: Constraints;
    status: (typeof couponStatus)[keyof typeof couponStatus];
}
