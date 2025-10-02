import { type Action, errorHandler } from "@/shared/index.js";
import couponModel from "./coupon.model.js";
import couponStatus from "./coupon.status.js";
import type { PostCouponSchema } from "./coupon.validate.js";

export type Code = { code: string };
const couponNotFound = (code: string): string =>
    `Coupon with code ${code} doesn't exists`;

class CouponStore {
    getAllCoupons = () =>
        errorHandler(() => couponModel.find(), "getting coupons list");

    addCoupon = (data: PostCouponSchema & Code) =>
        errorHandler(() => couponModel.create(data), "adding new coupon", {
            successStatus: 201,
        });

    getCoupon = (code: string) =>
        errorHandler(() => couponModel.findOne({ code }), "getting coupon", {
            notFoundError: couponNotFound(code),
        });

    changeCouponUsedTimes = (code: string, action: Action = "increas") =>
        errorHandler(
            () =>
                couponModel.findOneAndUpdate(
                    { code, used: { $gt: action === "increas" ? -1 : 0 } },
                    { $inc: { used: action === "increas" ? 1 : -1 } }
                ),
            `${action}ing coupon used count`,
            { notFoundError: couponNotFound(code) }
        );

    inactivateCoupon = (code: string) =>
        errorHandler(
            () =>
                couponModel.findOneAndUpdate(
                    { code },
                    { status: couponStatus.INACTIVE }
                ),
            "invalidating coupon",
            { notFoundError: couponNotFound(code) }
        );
}

export default new CouponStore();
