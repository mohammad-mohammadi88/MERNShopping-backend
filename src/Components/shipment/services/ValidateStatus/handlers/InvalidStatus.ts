import {
    shipmentStatus,
    type ShipmentStatusValue,
} from "@Shipment/shipment.status.js";
import AbstractStatusHandler from "../AbstractStatusHandler.js";

export default class InvalidStatus extends AbstractStatusHandler {
    public process(
        newStatus: ShipmentStatusValue,
        oldStatus: ShipmentStatusValue
    ) {
        const statusValues = Object.values(shipmentStatus);
        if (statusValues.includes(newStatus))
            return super["process"](newStatus, oldStatus);

        throw new Error("This shipment status is invalid");
    }
}
