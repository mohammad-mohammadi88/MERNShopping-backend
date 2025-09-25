import errorHandler from "@/shared/errorHandler.js";
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
}

export default new CouponStore();
