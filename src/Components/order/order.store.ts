import type { PipelineStage } from "mongoose";

import { couponModel } from "@Coupon/index.js";
import {
    errorHandler,
    paginateData,
    pipelines,
    searchAggretion,
    type GetDataFn,
    type GetterFnParams,
    type PaginationWithStatus,
} from "@Shared";
import {
    orderModel,
    type FullOrder,
    type IOrder,
    type PostOrderSchema,
} from "./index.js";

type PostOrderData = PostOrderSchema & {
    totalPrice: number;
    finalPrice: number;
};

class OrderStore {
    getAllOrders = ({
        pagination,
        ...params
    }: PaginationWithStatus & GetterFnParams) =>
        paginateData<IOrder>(this.getterFns(params), "orders", pagination);

    private getterFns =
        ({ query, status }: GetterFnParams): GetDataFn<IOrder> =>
        () =>
            this.searchData(
                query,
                status !== undefined ? [{ $match: { status } }] : undefined
            ) as any;

    private searchData = (
        query: string,
        extraSearch?: PipelineStage[] | undefined
    ) => {
        const orderFields = [
            ...pipelines.orderProducts.searchFields,
            ...pipelines.user.searchFields,
        ];
        let pipeline: PipelineStage[] = [
            ...pipelines.user.pipeline,
            ...pipelines.orderProducts.pipeline,
        ];
        pipeline = searchAggretion(pipeline, orderFields, query, extraSearch);
        return orderModel.aggregate(pipeline);
    };

    postOrder = (data: PostOrderData) =>
        errorHandler(() => orderModel.create(data), "creating new order", {
            successStatus: 201,
        });

    getOrdersCount = () =>
        errorHandler(() => orderModel.countDocuments(), "getting orders count");

    getOrder = (id: string) =>
        errorHandler(
            async (): Promise<FullOrder | null> => {
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
                return order as unknown as FullOrder;
            },
            "getting one order",
            {
                notFoundError: `Order with id #${id} doesn't exists`,
            }
        );

    editOrderStatus = (id: string, status: number) =>
        errorHandler(
            () => orderModel.findByIdAndUpdate(id, { status }),
            "editing order status",
            { notFoundError: `Order with id #${id} doesn't exists` }
        );

    editOrderData = (id: string, data: Partial<IOrder>) =>
        errorHandler(
            () => orderModel.findByIdAndUpdate(id, data),
            "editing order data",
            { notFoundError: `Order with id #${id} doesn't exists` }
        );

    addPaymentId = (id: string, payment: string) =>
        errorHandler(
            () => orderModel.findByIdAndUpdate(id, { payment }),
            "connecting order to payment"
        );
}

export default new OrderStore();
