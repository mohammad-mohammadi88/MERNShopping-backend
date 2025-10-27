import type { RequestHandler } from "express";
import type { ObjectId } from "mongoose";

import { validate } from "@Middlewares";
import { orderStore, ordersStatus } from "@Order/index.js";
import {
    paginationHandler,
    type GetDataWithPagination,
    type IQuery,
    type Pagination,
    type Status,
} from "@Shared";
import {
    addShipmentSchema,
    editShipmentStatusSchema,
    shipmentStatus,
    shipmentStore,
    type AddShipmentData,
    type AddShipmentSchema,
    type EditShipmentStatusSchema,
    type FullShipment,
    type IShipment,
} from "./index.js";
import { ShipmentStatusValidator } from "./services/index.js";

// add shipment
const addShipmentCTRL: RequestHandler<
    null,
    string | IShipment,
    AddShipmentSchema
> = async (req, res) => {
    const { selectedDate, note, order: orderId } = req.body;

    // check if order has shipment
    const exists = await shipmentStore.shipmentExistsWithOrderId(orderId);
    if (exists?._id)
        return res.status(429).send("This order has already have shipment");

    const {
        status: orderStatus,
        data: order,
        error: orderError,
    } = await orderStore.getOrder(orderId);
    if (orderError || !order) return res.status(orderStatus).send(orderError);

    const newShipment: AddShipmentData = {
        order: orderId,
        selectedDate,
        note,
        user: (order.user._id as ObjectId).toString(),
    };
    const {
        status: shipmentStatus,
        data: shipment,
        error: shipmentError,
    } = await shipmentStore.addShipment(newShipment);
    if (shipmentError) return res.status(shipmentStatus).send(shipmentError);

    const { status, error } = await orderStore.editOrderData(orderId, {
        status: ordersStatus.PROCESSING,
        shipment: shipment?._id as any,
    });
    if (error) return res.status(status).send(error);

    return res.status(shipmentStatus).send(shipment);
};
export const addShipmentHandler: any[] = [
    validate(addShipmentSchema),
    addShipmentCTRL,
];

// get all shipments
export const getAllShipmentsHandler: RequestHandler<
    null,
    string | GetDataWithPagination<IShipment>,
    null,
    Status & Pagination & IQuery
> = async (req, res) => {
    const reqStatus = req.query.status;
    const query = req.query.query || "";

    const pagination = paginationHandler(req);
    const { status, data, error } = await shipmentStore.getAllShipments({
        status: reqStatus ? Number(reqStatus) : undefined,
        query,
        pagination,
    });
    return res.status(status).send(data || error);
};

// edit shipment status
const editShimpentStatusCTRL: RequestHandler<
    { id: string },
    string | IShipment,
    EditShipmentStatusSchema
> = async (req, res) => {
    const newStatus = req.body.status;
    const shipmentId = req.params.id;

    const {
        status: prevShipmentStatus,
        data: prevShipment,
        error: prevShipmentError,
    } = await shipmentStore.getShipmentById(shipmentId);
    if (prevShipmentError || !prevShipment)
        return res.status(prevShipmentStatus).send(prevShipmentError);

    const oldStatus = prevShipment.status;

    // validate new status
    try {
        const validator = new ShipmentStatusValidator();
        validator.handler(newStatus, oldStatus);
    } catch (e) {
        const error = (e as Error).message;
        return res.status(400).send(error);
    }

    let newShipmentData: Partial<IShipment> = {
        status: newStatus,
    };
    if (newStatus === shipmentStatus.DELIVERED)
        newShipmentData.deliveredAt = new Date();

    const {
        status: status,
        error: error,
        data,
    } = await shipmentStore.editShipmentdata(shipmentId, newShipmentData);
    return res.status(status).send(data || error);
};
export const editShimpentStatusHandler: any[] = [
    validate(editShipmentStatusSchema),
    editShimpentStatusCTRL,
];

// get single Shipment
export const getSingleShipmentHandler: RequestHandler<
    { id: string },
    string | FullShipment
> = async (req, res) => {
    const shipmentId = req.params.id;

    const { status, data, error } = await shipmentStore.getShipmentById(
        shipmentId
    );
    return res.status(status).send(data || error);
};
