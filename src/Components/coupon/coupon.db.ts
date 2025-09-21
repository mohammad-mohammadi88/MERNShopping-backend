import errorHandler from "@/shared/errorHandler.js";
import type { PostCouponSchema } from "./coupon.validate.js";
import CouponModel from "./model/coupon.js";

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

const couponStore = new CouponStore();
export default couponStore;
