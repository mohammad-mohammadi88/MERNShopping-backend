import { z } from "zod";

import defaults from "@/shared/defaults.js";
import { productColorSchema } from "@Product/product.validate.js";
import { userAddressSchema } from "@User/user.validate.js";
import ordersStatus from "./order.status.js";

// coupon validation
const checkCoupon = (code?: string): boolean => {
    if (!code) return true;
    if (code.length !== defaults.couponCodeLength) return false;
    return true;
};

// coupon not valid error
const couponNotValid = {
    error: "Coupon Code in not valid",
    path: ["couponCode"],
};

const couponCode = z.string().optional().refine(checkCoupon, couponNotValid);

// order product
export const orderProductSchema = z.object({
    color: productColorSchema(z.number().nonnegative()).optional(),
    productID: z.string().length(24),
    count: z.number().optional(),
    productPrice: z.number().nonnegative(),
    productSalePrice: z.number().nonnegative(),
});
export type OrderProductSchema = z.infer<typeof orderProductSchema>;

// post order
export const postOrderSchema = z.object({
    products: z.array(orderProductSchema),
    couponCode,
    userId: z.string().length(24, "userId can only be 24 characters"),
    deliveryAddress: userAddressSchema.optional(),
});
export type PostOrderSchema = z.infer<typeof postOrderSchema>;

// edit oders status
const invalidStatusError = {
    error: `Order status can only be one of ${Object.values(ordersStatus).join(
        ", "
    )} values`,
    path: ["status"],
};
const statusValidator = (status: number): boolean =>
    (Object.values(ordersStatus) as number[]).includes(status);
export const editOrderStatusSchema = z.object({
    status: z.number().refine(statusValidator, invalidStatusError),
});
export type EditOrderStatusSchema = z.infer<typeof editOrderStatusSchema>;
