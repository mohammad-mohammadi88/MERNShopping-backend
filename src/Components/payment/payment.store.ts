import type { PipelineStage } from "mongoose";

import {
    errorHandler,
    paginateData,
    pipelines,
    searchAggretion,
    type GetDataFn,
    type IQuery,
    type PaginationWithStatus,
} from "@/shared/index.js";
import {
    paymentModel,
    type IPayment,
    type PaymentStatusValue,
} from "./index.js";

export interface NewPaymentData {
    order: string;
    amount: number;
    stripeSessionId: string;
    currency: string;
}
export interface UpdatePaymentData {
    paidAmount?: number;
    paymentId?: string;
    status: Exclude<PaymentStatusValue, 0>;
}
type GetterFnParams = { status: number | undefined } & IQuery;

class PaymentStore {
    getAllPayments = ({
        pagination,
        ...params
    }: PaginationWithStatus & GetterFnParams) =>
        paginateData<IPayment>(this.getterFns(params), "payments", pagination);

    private getterFns =
        ({ query, status }: GetterFnParams): GetDataFn<IPayment> =>
        () =>
            this.searchData(
                query,
                status !== undefined ? [{ $match: { status } }] : undefined
            ) as any;

    private searchData = async (
        query: string,
        extraSearch?: PipelineStage[] | undefined
    ) => {
        const paymentFields = [
            ...pipelines.user.searchFields,
            "stripeSessionId",
            "currency",
        ];
        const pipeline = searchAggretion(
            pipelines.user.pipeline,
            paymentFields,
            query,
            extraSearch
        );
        return await paymentModel.aggregate(pipeline);
    };

    addNewPayment = (data: NewPaymentData) =>
        errorHandler(() => paymentModel.create(data), "creating payment", {
            successStatus: 201,
        });

    updatePayment = (order: string, data: UpdatePaymentData) =>
        errorHandler(
            () => paymentModel.findOneAndUpdate({ order }, data),
            "updating payment",
            { notFoundError: `This payment doesn't exists` }
        );
}
export default new PaymentStore();
