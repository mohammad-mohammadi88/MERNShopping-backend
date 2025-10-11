import type ICoupon from "@Coupon/schema/coupon.d.js";
import AbstractCouponHandler from "../AbstractCouponHandler.js";

export default class UserHandler extends AbstractCouponHandler {
    public async process(userId: string, coupon: ICoupon): Promise<ICoupon> {
        if (coupon.user.toJSON() !== userId)
            throw new Error("You cannot use another ones coupon");
        return await super.process(userId, coupon);
    }
}
