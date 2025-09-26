import { z } from "zod";

import defaults from "@/shared/defaults.js";
import { productColorSchema } from "@Product/product.validate.js";
import { userAddressSchema } from "@User/user.validate.js";
import userStore from "../user/user.store.js";
import ordersStatus from "./order.status.js";

// coupon validation
const checkCoupon = (code?: string): boolean => {
    if (!code) return true;
    if (code.length !== defaults.couponCodeLength) return false;
    return true;
};

// coupon not valid error
const couponNotValid = {
    error: "Coupon Code is invalid",
    path: ["couponCode"],
};
const couponCode = z.string().optional().refine(checkCoupon, couponNotValid);

// user validator
// if error exists means user is not found or have problem in getting that users data
const checkUser = async (user: string): Promise<boolean> =>
    !(await userStore.getUserById(user)).error;

// user not valid error
const userNotValid = {
    error: "Unable to get user with this id",
    path: ["user"],
};
const user = z
    .string()
    .length(24, "user field should be 24 characters")
    .refine(checkUser, userNotValid);

// order product
export const orderProductSchema = z.object({
    color: productColorSchema(z.number().nonnegative()).optional(),
    product: z.string().length(24),
    count: z.number().optional(),
    productPrice: z.number().nonnegative(),
    productSalePrice: z.number().nonnegative(),
});
export type OrderProductSchema = z.infer<typeof orderProductSchema>;

// post order
export const postOrderSchema = z.object({
    products: z.array(orderProductSchema),
    couponCode,
    user,
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
