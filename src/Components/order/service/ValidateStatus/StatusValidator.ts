import {
    EndedStatusesToPrevious,
    InvalidStatus,
    OtherToInit,
    SameStatus,
} from "./handlers/index.js";
import type { OrderProcess } from "./StatusHandler.d.js";

export default class StatusValidator {
    handler: OrderProcess = (newStatus, oldStatus) => {
        const sameStatus = new SameStatus();
        const otherToInit = new OtherToInit();
        const invalidHandler = new InvalidStatus();
        const endedStatusHandler = new EndedStatusesToPrevious();

        sameStatus
            .setNext(invalidHandler)
            .setNext(otherToInit)
            .setNext(endedStatusHandler);

        return sameStatus.process(newStatus, oldStatus);
    };
}
