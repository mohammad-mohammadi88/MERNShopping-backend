import type ICoupon from "@Coupon/schema/coupon.d.js";
import AbstractCouponHandler from "../AbstractCouponHandler.js";

export default class LimitHandler extends AbstractCouponHandler {
    public process(user: string, coupon: ICoupon): ICoupon {
        if (coupon.limit <= coupon.used) throw new Error("This coupon is used");
        return super.process(user, coupon);
    }
}
