import type { RequestHandler } from "express";

import validateAsync from "@/middlewares/validateAsync.js";
import couponCodeGenerator from "@/services/coupon/couponCodeGenerator.js";
import couponStore, { type Code } from "./coupon.db.js";
import { postCouponSchema, type PostCouponSchema } from "./coupon.validate.js";
import type ICoupon from "./schema/coupon.d.js";

// get all coupons
export const getAllCouponsHandler: RequestHandler<
    null,
    string | ICoupon[]
> = async (req, res) => {
    const { status, data, error } = await couponStore.getAllCoupons();
    return res.status(status).send(data || error);
};

// post new coupon
const postCouponCTRL: RequestHandler<
    null,
    string | ICoupon,
    PostCouponSchema
> = async (req, res) => {
    const newCoupon: PostCouponSchema & Code = {
        ...req.body,
        code: couponCodeGenerator(),
    };
    const { status, data, error } = await couponStore.addCoupon(newCoupon);
    return res.status(status).send(data || error);
};
export const postCouponHandler: any[] = [
    validateAsync(postCouponSchema),
    postCouponCTRL,
];

// get coupon with id
export const getCouponWithIdHandler: RequestHandler<
    { id: string },
    string | ICoupon
> = async (req, res) => {
    const { status, data, error } = await couponStore.getCoupon(req.params.id);
    return res.status(status).send(data || error);
};
