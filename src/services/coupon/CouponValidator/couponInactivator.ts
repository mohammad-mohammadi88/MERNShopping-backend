import couponStatus from "@Coupon/coupon.status.js";
import couponStore from "@Coupon/coupon.store.js";

export default async (code: string): Promise<void> => {
    const { error } = await couponStore.updateCouponStatus(
        code,
        couponStatus.INACTIVE
    );
    if (error) throw new Error(error);
    return;
};
