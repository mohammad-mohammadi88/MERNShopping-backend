import ordersStatus, { type OrderStatusValue } from "@Order/order.status.js";
import { capitalize, statusToString } from "@Shared";
import AbstractStatusHandler from "../AbstractStatusHandler.js";

// ended statuses are "RECEIVED" and "CANCELED"
export default class EndedStatusesToPrevious extends AbstractStatusHandler {
    public process(newStatus: any, oldStatus: OrderStatusValue) {
        const isEndedStatus =
            oldStatus === ordersStatus.CANCELED ||
            oldStatus === ordersStatus.RECEIVED;
        if (!isEndedStatus) return super["process"](newStatus, oldStatus);

        // I will make sure an invalid status doesn't pass
        const statusText = capitalize(statusToString(ordersStatus, oldStatus)!);
        throw new Error(`Order with status ${statusText} isn't updatable`);
    }
}
