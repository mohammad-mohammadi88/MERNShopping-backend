import type ICoupon from "@Coupon/schema/coupon.d.js";
import type CouponHandler from "./CouponHandler.d.js";

export default class AbstractCouponHandler implements CouponHandler {
    private nextHandler: CouponHandler | undefined;

    public setNext = (handler: CouponHandler): CouponHandler =>
        (this.nextHandler = handler);

    public process(userId: string, request: ICoupon): ICoupon {
        return this.nextHandler
            ? this.nextHandler.process(userId, request)
            : request;
    }
}
