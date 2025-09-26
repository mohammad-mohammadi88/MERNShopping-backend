import { type Action, errorHandler } from "@/shared/index.js";
import CouponModel from "./coupon.model.js";
import type { PostCouponSchema } from "./coupon.validate.js";

export type Code = { code: string };
class CouponStore {
    getAllCoupons = () =>
        errorHandler(() => CouponModel.find(), "getting coupons list");

    addCoupon = (data: PostCouponSchema & Code) =>
        errorHandler(() => CouponModel.create(data), "adding new coupon", {
            successStatus: 201,
        });

    getCoupon = (code: string) =>
        errorHandler(() => CouponModel.findOne({ code }), "getting coupon", {
            notFoundError: `Coupon with code ${code} doesn't exists`,
        });

    changeCouponUsedTimes = (code: string, action: Action = "increas") =>
        errorHandler(
            () =>
                CouponModel.findOneAndUpdate(
                    { code, used: { $gt: action === "increas" ? -1 : 0 } },
                    { $inc: { used: action === "increas" ? 1 : -1 } }
                ),
            `${action}ing coupon used count`,
            { notFoundError: `Coupon code ${code} doesn't exists` }
        );
}

export default new CouponStore();
