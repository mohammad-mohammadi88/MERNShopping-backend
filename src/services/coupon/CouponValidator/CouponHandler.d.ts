import type ICoupon from "@Coupon/schema/coupon.d.js";

export default interface CouponHandler {
    setNext: (handler: CouponHandler) => CouponHandler;
    process: (userId: string, request: ICoupon) => ICoupon;
}
