import couponStatus from "@Coupon/coupon.status.js";
import type ICoupon from "@Coupon/schema/coupon.d.js";
import AbstractCouponHandler from "../AbstractCouponHandler.js";

export default class StatusHandler extends AbstractCouponHandler {
    public async process(userId: string, coupon: ICoupon): Promise<ICoupon> {
        if (coupon.status === couponStatus.INACTIVE)
            throw new Error(`Coupon with code ${coupon.code} is inactive`);
        return await super.process(userId, coupon);
    }
}
