import type { RequestHandler } from "express";

import couponCodeGenerator from "@Coupon/couponCodeGenerator.js";
import { validate, validateAsync } from "@Middlewares";
import {
    paginationHandler,
    type GetDataWithPagination,
    type IQuery,
    type Pagination,
    type Status,
} from "@Shared";
import {
    couponStatus,
    couponStore,
    editCouponStatusSchema,
    postCouponSchema,
    type Code,
    type EditCouponStatusSchema,
    type FullCoupon,
    type ICoupon,
    type PostCouponSchema,
} from "./index.js";

// get all coupons
export const getAllCouponsHandler: RequestHandler<
    null,
    string | GetDataWithPagination<FullCoupon>,
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

// get coupon with code
export const getCouponWithCodeHandler: RequestHandler<
    { code: string },
    string | ICoupon
> = async (req, res) => {
    const { status, data, error } = await couponStore.getCoupon(
        req.params.code
    );
    return res.status(status).send(data || error);
};

const editCouponStatusCTRL: RequestHandler<
    { code: string },
    string | ICoupon,
    EditCouponStatusSchema
> = async (req, res) => {
    const newStatus = req.body.status;
    const couponCode = req.params.code;
    const {
        status: couponStatusCode,
        data: prevCoupon,
        error: couponError,
    } = await couponStore.getCoupon(couponCode);
    if (couponError || !prevCoupon)
        return res.status(couponStatusCode).send(couponError);

    const { status: oldStatus, limit, used, expiresAt } = prevCoupon;
    if (oldStatus === newStatus)
        return res
            .status(400)
            .send("You don't need to update coupon status to same state");

    const isExpired = expiresAt.getTime() >= Date.now();
    const isUsedEnough = limit === used;
    if (newStatus === couponStatus.ACTIVE && (isUsedEnough || isExpired))
        return res
            .status(400)
            .send("You cannot activate expired and used coupon");

    const { status, data, error } = await couponStore.updateCouponStatus(
        couponCode,
        newStatus
    );
    return res.status(status).send(data || error);
};
export const editCouponStatusHandler: any[] = [
    validate(editCouponStatusSchema),
    editCouponStatusCTRL,
];
