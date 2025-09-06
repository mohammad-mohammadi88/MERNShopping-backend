import AbstractCouponHandler from "../AbstractCouponHandler.js";
import type ICoupon from "@Coupon/schema/coupon.d.js";
import type IUser from "@Users/schema/users.d.js";

export default class UserHandler extends AbstractCouponHandler {
    public process = (user: IUser, coupon: ICoupon): ICoupon => {
        if (coupon.constraints.user !== user._id)
            throw new Error("You cannot use another ones coupon");
        return super["process"](user, coupon);
    };
}
