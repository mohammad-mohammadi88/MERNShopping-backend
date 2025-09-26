import type ICoupon from "@Coupon/schema/coupon.d.js";
import AbstractCouponHandler from "../AbstractCouponHandler.js";

export default class UserHandler extends AbstractCouponHandler {
    public process(userId: string, coupon: ICoupon): ICoupon {
        if (coupon.constraints.user.toJSON() !== userId)
            throw new Error("You cannot use another ones coupon");
        return super.process(userId, coupon);
    }
}
