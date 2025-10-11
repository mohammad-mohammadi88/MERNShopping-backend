import type { RequestHandler } from "express";

import validateAsync from "@/middlewares/validateAsync.js";
import type {
    GetDataWithPagination,
    IQuery,
    Pagination,
    Status,
} from "@/shared/index.js";
import paginationHandler from "@/shared/paginationHandler.js";
import couponCodeGenerator from "@Coupon/couponCodeGenerator.js";
import couponStore, { type Code } from "./coupon.store.js";
import { postCouponSchema, type PostCouponSchema } from "./coupon.validate.js";
import type ICoupon from "./schema/coupon.d.js";

// get all coupons
export const getAllCouponsHandler: RequestHandler<
    null,
    string | GetDataWithPagination<ICoupon>,
    null,
    Status & Pagination & IQuery
> = async (req, res) => {
    const reqStatus = req.query.status;
    const query = req.query.query || "";

    const pagination = paginationHandler(req);
    const { status, data, error } = await couponStore.getAllCoupons({
        query,
        status: reqStatus ? Number(reqStatus) : undefined,
        pagination,
    });
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
