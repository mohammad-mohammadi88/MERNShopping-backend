import {
    type GetDataFn,
    type IQuery,
    type PaginationWithStatus,
    errorHandler,
    paginateData,
    searchFields,
} from "@/shared/index.js";
import type { PipelineStage } from "mongoose";
import couponModel from "../coupon/coupon.model.js";
import { default as OrderModel, default as orderModel } from "./order.model.js";
import type { PostOrderSchema } from "./order.validate.js";
import type IOrder from "./schema/order.d.js";

type PostOrderData = PostOrderSchema & {
    totalPrice: number;
    finalPrice: number;
};
type GetterFnParams = { status: number | undefined } & IQuery;

class OrderStore {
    getAllOrders = ({
        pagination,
        ...params
    }: PaginationWithStatus & GetterFnParams) =>
        paginateData<IOrder>(this.getterFns(params), "order", pagination);

    private getterFns =
        ({ query, status }: GetterFnParams): GetDataFn<IOrder> =>
        () =>
            this.searchData(
                query,
                status ? [{ $match: { status } }] : undefined
            ) as any;

    private searchData = (
        query: string,
        extraSearch?: PipelineStage[] | undefined
    ) => {
        const userFields = [
            "couponCode",
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
            { $unwind: "$products" },
            {
                $lookup: {
                    from: "products",
                    localField: "products.product",
                    foreignField: "_id",
                    as: "products.product",
                },
            },
            { $unwind: "$products.product" },
            {
                $group: {
                    _id: "$_id",
                    doc: { $first: "$$ROOT" },
                    products: { $push: "$products" },
                },
            },
            { $addFields: { "doc.products": "$products" } },
            { $replaceRoot: { newRoot: "$doc" } },
        ];
        const orConditions = searchFields(userFields, query);
        if (orConditions.length > 0 && query.trim() !== "") {
            pipeline.push({ $match: { $or: orConditions } });
        }

        if (extraSearch) pipeline.push(...extraSearch);
        return orderModel.aggregate(pipeline);
    };

    postOrder = (data: PostOrderData) =>
        errorHandler(() => OrderModel.create(data), "creating new order", {
            successStatus: 201,
        });

    getOrdersCount = () =>
        errorHandler(() => OrderModel.countDocuments(), "getting orders count");

    getOrder = (id: string) =>
        errorHandler(
            async () => {
                const order = await orderModel
                    .findById(id)
                    .lean()
                    .populate(["user", "products.product"]);
                if (!order) return null;
                if (order.couponCode) {
                    const coupon = await couponModel
                        .findOne({ code: order.couponCode })
                        .lean();
                    order.couponCode = coupon as any;
                }
                return order;
            },
            "getting one order",
            {
                notFoundError: `Order with id #${id} doesn't exists`,
            }
        );

    editOrderStatus = (id: string, status: number) =>
        errorHandler(
            () => OrderModel.findByIdAndUpdate(id, { status }),
            "editing order status",
            { notFoundError: `Order with id #${id} doesn't exists` }
        );
}

export default new OrderStore();
