import userStore from "@User/user.store.js";
import { z } from "zod";
import defaults from "./defaults.js";

// user validator
// if error exists means user is not found or have problem in getting that users data
const checkUser = async (user: string): Promise<boolean> =>
    !(await userStore.getUserById(user)).error;

// user not valid error
const userNotValid = {
    error: "Unable to get user with this id",
};
export const userSchema = z
    .string()
    .length(24, "user field should be 24 characters")
    .refine(checkUser, userNotValid);

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
