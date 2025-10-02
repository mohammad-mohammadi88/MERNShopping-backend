import couponStore from "@Coupon/coupon.store.js";

export default async (code: string): Promise<void> => {
    const { error } = await couponStore.inactivateCoupon(code);
    if (error) throw new Error(error);
    return;
};
