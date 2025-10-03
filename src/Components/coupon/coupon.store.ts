import type {
    Action,
    GetDataFns,
    PaginationWithStatus,
} from "@/shared/index.js";
import { errorHandler, paginateData } from "@/shared/index.js";
import couponModel from "./coupon.model.js";
import couponStatus from "./coupon.status.js";
import type { PostCouponSchema } from "./coupon.validate.js";
import type ICoupon from "./schema/coupon.d.js";

export type Code = { code: string };
const couponNotFound = (code: string): string =>
    `Coupon with code ${code} doesn't exists`;

const getterFns: (status?: number) => GetDataFns<ICoupon> = (status) => ({
    getDataFn: () =>
        couponModel
            .find(typeof status === "number" ? { status } : {})
            .populate(["constraints.user"]),
    getCountFn: () => couponModel.countDocuments(),
});
class CouponStore {
    getAllCoupons = ({ status, pagination }: PaginationWithStatus) =>
        paginateData<ICoupon>(getterFns(status), "coupon", pagination);

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
