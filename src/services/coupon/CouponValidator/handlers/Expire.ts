import AbstractCouponHandler from "../AbstractCouponHandler.js";
import type ICoupon from "@Coupon/schema/coupon.d.js";
import type IUser from "@Users/schema/users.d.js";

export default class ExpireHandler extends AbstractCouponHandler {
    public process = (user: IUser, coupon: ICoupon): ICoupon => {
        if (coupon.expiresAt.getTime() < Date.now())
            throw new Error("This coupon is expired");
        return super["process"](user, coupon);
    };
}
