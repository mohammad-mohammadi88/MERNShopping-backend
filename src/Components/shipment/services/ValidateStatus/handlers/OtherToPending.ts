import {
    shipmentStatus,
    type ShipmentStatusValue,
} from "@Shipment/shipment.status.js";
import AbstractStatusHandler from "../AbstractStatusHandler.js";

export default class OtherToPending extends AbstractStatusHandler {
    public process(
        newStatus: ShipmentStatusValue,
        oldStatus: ShipmentStatusValue
    ) {
        if (newStatus !== shipmentStatus.PENDING)
            return super["process"](newStatus, oldStatus);

        throw new Error("You can't comeback to status Pending");
    }
}
