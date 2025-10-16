import type ICoupon from "@Coupon/schema/coupon.d.js";

export type CouponProcess = (
    userId: string,
    request: ICoupon
) => Promise<ICoupon>;
export default interface CouponHandler {
    setNext: (handler: CouponHandler) => CouponHandler;
    process: CouponProcess;
}
