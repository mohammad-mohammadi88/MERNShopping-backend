import type { ICoupon } from "@Coupon/index.js";

// to handle price when coupon role is "number"
const handleNumberPrice = (
    price: number,
    couponAmount: number,
    orderProductsCount: number
) => {
    const discountPrice = couponAmount / orderProductsCount;
    return Math.max(price - discountPrice, 0);
};

// to handle price when coupon role is "percent"
const handlePercentPrice = (price: number, couponPercent: number) =>
    price - price * (couponPercent / 100);

type IfCoupon = {
    coupon: ICoupon;
    orderProductsCount: number;
};
export default (price: number, couponInfo?: IfCoupon) => {
    if (!couponInfo) return price;

    const { coupon, orderProductsCount } = couponInfo;
    const { amount, role } = coupon.discount;

    const finalPrice =
        role === "number"
            ? handleNumberPrice(price, amount, orderProductsCount)
            : handlePercentPrice(price, amount);

    return Math.round(finalPrice * 100) / 100;
};
