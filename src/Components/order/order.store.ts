import type { PipelineStage } from "mongoose";

import {
    errorHandler,
    paginateData,
    pipelines,
    searchAggretion,
    type GetDataFn,
    type GetterFnParams,
    type PaginationWithStatus,
} from "@Shared";
import { couponStore, type ICoupon } from "../coupon/index.js";
import {
    orderModel,
    ordersStatus,
    type FullOrder,
    type IOrder,
    type OrderWithCoupon,
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
        errorHandler(
            () =>
                orderModel.countDocuments({ status: ordersStatus.PROCESSING }),
            "getting orders count"
        );

    getOrder = (id: string) =>
        errorHandler(
            async (): Promise<FullOrder | null> =>
                orderModel
                    .findById(id)
                    .populate(["products.product"])
                    .lean<FullOrder | null>(),
            "getting one order",
            {
                notFoundError: `Order with id #${id} doesn't exists`,
            }
        );

    getOrderWithCoupon = (id: string) =>
        errorHandler(
            async (): Promise<OrderWithCoupon | null> => {
                const { data: order, error } = await this.getOrder(id);
                if (error || !order) throw error;

                if (order?.couponCode) {
                    const { data, error: couponError } =
                        await couponStore.getCoupon(order?.couponCode);
                    if (couponError || !data) throw couponError;

                    (order as OrderWithCoupon).couponCode = data as ICoupon;
                }
                return order as OrderWithCoupon;
            },
            "getting one order",
            {
                notFoundError: `Order with id #${id} doesn't exists`,
            }
        );

    editOrderStatus = (id: string, status: number) =>
        errorHandler(
            () =>
                orderModel
                    .findByIdAndUpdate(id, { status }, { new: true })
                    .lean<IOrder>()
                    .exec(),
            "editing order status",
            { notFoundError: `Order with id #${id} doesn't exists` }
        );

    editOrderData = (id: string, data: Partial<IOrder>) =>
        errorHandler(
            () =>
                orderModel
                    .findByIdAndUpdate(id, data, { new: true })
                    .lean<IOrder>()
                    .exec(),
            "editing order data",
            { notFoundError: `Order with id #${id} doesn't exists` }
        );

    addPaymentId = (id: string, payment: string) =>
        errorHandler(
            () =>
                orderModel
                    .findByIdAndUpdate(id, { payment }, { new: true })
                    .lean<IOrder>()
                    .exec(),
            "connecting order to payment"
        );
}

export default new OrderStore();
