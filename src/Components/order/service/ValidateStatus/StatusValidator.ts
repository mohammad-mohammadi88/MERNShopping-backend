import {
    EndedStatusesToPrevious,
    InitNotToCanceled,
    InvalidStatus,
} from "./handlers/index.js";
import type { OrderProcess } from "./StatusHandler.d.js";

export default class StatusValidator {
    handler: OrderProcess = (newStatus, oldStatus) => {
        const invalidHandler = new InvalidStatus();
        const initToCanceledHandler = new InitNotToCanceled();
        const endedStatusHandler = new EndedStatusesToPrevious();

        invalidHandler
            .setNext(initToCanceledHandler)
            .setNext(endedStatusHandler);

        return invalidHandler.process(newStatus, oldStatus);
    };
}
