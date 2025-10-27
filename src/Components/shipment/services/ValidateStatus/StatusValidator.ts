import {
    DeliveredToOther,
    InvalidStatus,
    OtherToPending,
    SameStatus,
} from "./handlers/index.js";
import type { ShipmentProcess } from "./StatusHandler.d.js";

export default class StatusValidator {
    handler: ShipmentProcess = (newStatus, oldStatus) => {
        const sameStatus = new SameStatus();
        const otherToPending = new OtherToPending();
        const invalidHandler = new InvalidStatus();
        const deliveredStatusHandler = new DeliveredToOther();

        sameStatus
            .setNext(invalidHandler)
            .setNext(otherToPending)
            .setNext(deliveredStatusHandler);

        return sameStatus.process(newStatus, oldStatus);
    };
}
