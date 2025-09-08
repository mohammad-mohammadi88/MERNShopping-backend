import AbstractCouponHandler from "../AbstractCouponHandler.js";
import type ICoupon from "@Coupon/schema/coupon.d.js";
import type IUser from "@Users/schema/users.d.js";

export default class LimitHandler extends AbstractCouponHandler {
    public process = (user: IUser, coupon: ICoupon): ICoupon => {
        if (coupon.limit <= coupon.used) throw new Error("This coupon is used");
        return super["process"](user, coupon);
    };
}
