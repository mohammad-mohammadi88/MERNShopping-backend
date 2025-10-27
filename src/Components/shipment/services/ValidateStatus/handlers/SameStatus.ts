import type { ShipmentStatusValue } from "@Shipment/shipment.status.js";
import AbstractStatusHandler from "../AbstractStatusHandler.js";

export default class SameStatus extends AbstractStatusHandler {
    public process(
        newStatus: ShipmentStatusValue,
        oldStatus: ShipmentStatusValue
    ) {
        if (newStatus !== oldStatus)
            return super["process"](newStatus, oldStatus);

        throw new Error("You don't need to update status to the same status");
    }
}
