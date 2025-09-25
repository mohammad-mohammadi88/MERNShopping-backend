const couponStatus = {
    ACTIVE: 0,
    INACTIVE: 1,
} as const;
type CouponStatus = typeof couponStatus;
export type CouponStatusKey = keyof CouponStatus;
export type CouponStatusValue = CouponStatus[CouponStatusKey];
export default couponStatus;
