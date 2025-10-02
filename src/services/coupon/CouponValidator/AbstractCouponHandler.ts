import type ICoupon from "@Coupon/schema/coupon.d.js";
import type CouponHandler from "./CouponHandler.js";

export default class AbstractCouponHandler implements CouponHandler {
    private nextHandler: CouponHandler | undefined;

    public setNext = (handler: CouponHandler): CouponHandler =>
        (this.nextHandler = handler);

    public async process(userId: string, request: ICoupon): Promise<ICoupon> {
        return this.nextHandler
            ? await this.nextHandler.process(userId, request)
            : request;
    }
}
