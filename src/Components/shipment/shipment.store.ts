import type { PipelineStage } from "mongoose";

import {
    errorHandler,
    paginateData,
    pipelines,
    searchAggretion,
    type GetDataFn,
    type IQuery,
    type PaginationWithStatus,
} from "@Shared";
import { shipmentModel, type FullShipment, type IShipment } from "./index.js";

export interface AddShipmentData {
    user: string;
    order: string;
    selectedDate: Date;
    note?: string;
}
type GetterFnParams = { status: number | undefined } & IQuery;
class ShipmentStore {
    addShipment = (data: AddShipmentData) =>
        errorHandler(
            () => shipmentModel.create(data),
            "creating new shipment",
            { successStatus: 201 }
        );

    private getDataFn =
        ({ query, status }: GetterFnParams): GetDataFn<IShipment> =>
        () =>
            this.searchData(
                query,
                status !== undefined ? [{ $match: { status } }] : undefined
            ) as any;

    getAllShipments = ({
        pagination,
        ...params
    }: PaginationWithStatus & GetterFnParams) =>
        paginateData<IShipment>(this.getDataFn(params), "shipment", pagination);

    private searchData = (
        query: string,
        extraSearch?: PipelineStage[] | undefined
    ) =>
        shipmentModel.aggregate<IShipment>(
            searchAggretion(
                pipelines.user.pipeline,
                pipelines.user.searchFields,
                query,
                extraSearch
            )
        );

    getShipmentById = (id: string) =>
        errorHandler(
            () =>
                shipmentModel
                    .findById(id)
                    .populate(["order"])
                    .lean<FullShipment>()
                    .exec(),
            "getting shipment",
            {
                notFoundError: `Shipment with id #${id} doesn't exists`,
            }
        );

    shipmentExistsWithOrderId = (order: string) =>
        shipmentModel.exists({ order }).exec();

    editShipmentdata = (id: string, data: Partial<IShipment>) =>
        errorHandler(
            () =>
                shipmentModel
                    .findByIdAndUpdate(id, data, { new: true })
                    .lean<IShipment>()
                    .exec(),
            "editing shipment data",
            { notFoundError: `Shipment with id #${id} doesn't exists` }
        );
}
export default new ShipmentStore();
