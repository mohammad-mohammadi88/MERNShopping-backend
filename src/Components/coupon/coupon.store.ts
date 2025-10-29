import type { PipelineStage } from "mongoose";

import type { Action, GetDataFn, IQuery, PaginationWithStatus } from "@Shared";
import {
    errorHandler,
    paginateData,
    pipelines,
    searchAggretion,
} from "@Shared";
import {
    couponModel,
    couponStatus,
    type ICoupon,
    type PostCouponSchema,
} from "./index.js";

export type Code = { code: string };
const couponNotFound = (code: string): string =>
    `Coupon with code ${code} doesn't exists`;

type GetterFnParams = { status: number | undefined } & IQuery;
class CouponStore {
    private getDataFn =
        ({ query, status }: GetterFnParams): GetDataFn<ICoupon> =>
        () =>
            this.searchData(
                query,
                status !== undefined ? [{ $match: { status } }] : undefined
            ) as any;

    getAllCoupons = ({
        pagination,
        ...params
    }: PaginationWithStatus & GetterFnParams) =>
        paginateData<ICoupon>(this.getDataFn(params), "coupons", pagination);

    private searchData = (
        query: string,
        extraSearch?: PipelineStage[] | undefined
    ) => {
        const couponFields = ["code", ...pipelines.user.searchFields];
        const pipeline = searchAggretion(
            pipelines.user.pipeline,
            couponFields,
            query,
            extraSearch
        );
        return couponModel.aggregate(pipeline);
    };

    addCoupon = (data: PostCouponSchema & Code) =>
        errorHandler(() => couponModel.create(data), "adding new coupon", {
            successStatus: 201,
        });

    getCoupon = (code: string) =>
        errorHandler(() => couponModel.findOne({ code }), "getting coupon", {
            notFoundError: couponNotFound(code),
        });

    changeCouponUsedTimes = (code: string, action: Action = "increas") =>
        errorHandler(
            () =>
                couponModel.findOneAndUpdate(
                    { code, used: { $gt: action === "increas" ? -1 : 0 } },
                    { $inc: { used: action === "increas" ? 1 : -1 } }
                ),
            `${action}ing coupon used count`,
            { notFoundError: couponNotFound(code) }
        );

    inactivateCoupon = (code: string) =>
        errorHandler(
            () =>
                couponModel.findOneAndUpdate(
                    { code },
                    { status: couponStatus.INACTIVE }
                ),
            "invalidating coupon",
            { notFoundError: couponNotFound(code) }
        );
}

export default new CouponStore();
