import type ICoupon from "@Coupon/schema/coupon.d.js";
import AbstractCouponHandler from "../AbstractCouponHandler.js";
import couponInactivator from "../couponInactivator.js";

export default class LimitHandler extends AbstractCouponHandler {
    public async process(userId: string, coupon: ICoupon): Promise<ICoupon> {
        if (coupon.limit > coupon.used)
            return await super.process(userId, coupon);

        await couponInactivator(coupon.code);
        throw new Error("This coupon is used");
    }
}
