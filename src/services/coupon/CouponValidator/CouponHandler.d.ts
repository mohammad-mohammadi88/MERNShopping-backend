import type IUser from "@Users/schema/users";
import type ICoupon from "@Coupon/schema/coupon";

export default interface CouponHandler {
    setNext: (handler: CouponHandler) => CouponHandler;
    process: (user: IUser, request: ICoupon) => ICoupon;
}
