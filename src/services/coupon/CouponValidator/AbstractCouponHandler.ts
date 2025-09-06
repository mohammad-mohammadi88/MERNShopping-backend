import type ICoupon from "@Coupon/schema/coupon.d.js";
import type CouponHandler from "./CouponHandler.d.js";
import type IUser from "@Users/schema/users.d.js";

export default class AbstractCouponHandler implements CouponHandler {
    private nextHandler: CouponHandler | undefined;

    public setNext = (handler: CouponHandler): CouponHandler =>
        (this.nextHandler = handler);

    public process = (user: IUser, request: ICoupon): ICoupon =>
        this.nextHandler && this.nextHandler.process(user, request);
}
