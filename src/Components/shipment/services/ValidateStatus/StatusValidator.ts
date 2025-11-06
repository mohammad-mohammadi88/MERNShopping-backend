import {
    EndedStatusToOther,
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
        const endedStatusHandler = new EndedStatusToOther();

        sameStatus
            .setNext(invalidHandler)
            .setNext(otherToPending)
            .setNext(endedStatusHandler);

        return sameStatus.process(newStatus, oldStatus);
    };
}
