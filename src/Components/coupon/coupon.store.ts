import type { PipelineStage } from "mongoose";

import type {
    Action,
    GetDataFns,
    IQuery,
    PaginationWithStatus,
} from "@/shared/index.js";
import { errorHandler, paginateData, searchFields } from "@/shared/index.js";
import couponModel from "./coupon.model.js";
import couponStatus from "./coupon.status.js";
import type { PostCouponSchema } from "./coupon.validate.js";
import type ICoupon from "./schema/coupon.d.js";

export type Code = { code: string };
const couponNotFound = (code: string): string =>
    `Coupon with code ${code} doesn't exists`;

type GetterFnParams = { status: number | undefined } & IQuery;
class CouponStore {
    private getterFns = ({
        query,
        status,
    }: GetterFnParams): GetDataFns<ICoupon> => ({
        getDataFn: () =>
            this.searchData(
                query,
                status ? [{ $match: { status } }] : undefined
            ) as any,
        getCountFn: () => couponModel.countDocuments(),
    });

    getAllCoupons = ({
        pagination,
        ...params
    }: PaginationWithStatus & GetterFnParams) =>
        paginateData<ICoupon>(this.getterFns(params), "coupon", pagination);

    private searchData = (
        query: string,
        extraSearch?: PipelineStage[] | undefined
    ) => {
        const userFields = [
            "code",
            "user.firstName",
            "user.lastName",
            "user.email",
            "user.mobile",
        ];
        const pipeline: PipelineStage[] = [
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
        ];
        const orConditions = searchFields(userFields, query);
        if (orConditions.length > 0 && query.trim() !== "") {
            pipeline.push({ $match: { $or: orConditions } });
        }

        if (extraSearch) pipeline.push(...extraSearch);
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
