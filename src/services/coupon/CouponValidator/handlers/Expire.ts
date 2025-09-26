import type ICoupon from "@Coupon/schema/coupon.d.js";
import AbstractCouponHandler from "../AbstractCouponHandler.js";

export default class ExpireHandler extends AbstractCouponHandler {
    public process(user: string, coupon: ICoupon): ICoupon {
        if (coupon.expiresAt.getTime() < Date.now())
            throw new Error("This coupon is expired");
        return super.process(user, coupon);
    }
}
