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
    type FullCoupon,
    type ICoupon,
    type PostCouponSchema,
} from "./index.js";

export type Code = { code: string };
const couponNotFound = (code: string): string =>
    `Coupon with code ${code} doesn't exists`;

type GetterFnParams = { status: number | undefined } & IQuery;
class CouponStore {
    private getDataFn =
        ({ query, status }: GetterFnParams): GetDataFn<FullCoupon> =>
        () =>
            this.searchData(
                query,
                status !== undefined ? [{ $match: { status } }] : undefined
            ) as any;

    getAllCoupons = ({
        pagination,
        ...params
    }: PaginationWithStatus & GetterFnParams) =>
        paginateData<FullCoupon>(this.getDataFn(params), "coupons", pagination);

    private searchData = (
        query: string,
        extraSearch?: PipelineStage[] | undefined
    ) =>
        couponModel.aggregate<FullCoupon>(
            searchAggretion(
                pipelines.user.pipeline,
                ["code", ...pipelines.user.searchFields],
                query,
                extraSearch
            )
        );

    addCoupon = (data: PostCouponSchema & Code) =>
        errorHandler(() => couponModel.create(data), "adding new coupon", {
            successStatus: 201,
        });

    getCoupon = (code: string) =>
        errorHandler(
            () => couponModel.findOne({ code }).lean<ICoupon>().exec(),
            "getting coupon",
            {
                notFoundError: couponNotFound(code),
            }
        );

    changeCouponUsedTimes = (code: string, action: Action = "increas") =>
        errorHandler(
            () =>
                couponModel
                    .findOneAndUpdate(
                        { code, used: { $gt: action === "increas" ? -1 : 0 } },
                        { $inc: { used: action === "increas" ? 1 : -1 } },
                        { new: true }
                    )
                    .lean<ICoupon>()
                    .exec(),
            `${action}ing coupon used count`,
            { notFoundError: couponNotFound(code) }
        );

    updateCouponStatus = (code: string, status: number) =>
        errorHandler(
            () =>
                couponModel
                    .findOneAndUpdate({ code }, { status })
                    .lean<ICoupon>()
                    .exec(),
            "invalidating coupon",
            { notFoundError: couponNotFound(code) }
        );
}

export default new CouponStore();
