import { capitalize, statusToString } from "@/shared/index.js";
import {
    shipmentStatus,
    type ShipmentStatusValue,
} from "@Shipment/shipment.status.js";
import AbstractStatusHandler from "../AbstractStatusHandler.js";

export default class EndedStatusToOther extends AbstractStatusHandler {
    public process(
        newStatus: ShipmentStatusValue,
        oldStatus: ShipmentStatusValue
    ) {
        if (
            oldStatus !== shipmentStatus.DELIVERED &&
            oldStatus !== shipmentStatus.ABSENT
        )
            return super["process"](newStatus, oldStatus);

        // I will make sure an invalid status doesn't pass
        const statusText = capitalize(
            statusToString(shipmentStatus, oldStatus)!
        );
        throw new Error(`Shipment with status ${statusText} isn't updatable`);
    }
}
