import { z } from "zod";

import { productStore } from "@Product/index.js";
import { userStore } from "@User/index.js";
import defaults from "./defaults.js";

// user validator
const checkUser = async (user: string): Promise<boolean> =>
    await userStore.isUserExists(user);

// user not valid error
const userNotValid = {
    error: "Unable to get user with this id",
};
export const userSchema = z
    .string()
    .length(24, "user field should be 24 characters")
    .refine(checkUser, userNotValid);

// product validator
const checkProduct = async (product: string): Promise<boolean> =>
    await productStore.isProductExists(product);

// product not valid error
const productNotValid = {
    error: "Unable to get product with this id",
};
export const productSchema = z
    .string()
    .length(24, "product field should be 24 characters")
    .refine(checkProduct, productNotValid);

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
export const couponCodeSchema = z
    .string()
    .optional()
    .refine(checkCoupon, couponNotValid);
