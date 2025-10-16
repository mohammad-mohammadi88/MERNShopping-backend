import { capitalize, statusToString } from "@/shared/index.js";
import type { OrderStatusValue } from "@Order/order.status.js";
import ordersStatus from "@Order/order.status.js";
import AbstractStatusHandler from "../AbstractStatusHandler.js";

// ended statuses are "RECEIVED" and "CANCELED"
export default class EndedStatusesToPrevious extends AbstractStatusHandler {
    public process(_: any, oldStatus: OrderStatusValue): boolean {
        const isEndedStatus =
            oldStatus === ordersStatus.CANCELED ||
            oldStatus === ordersStatus.RECEIVED;
        if (!isEndedStatus) return true;

        // I will make sure an invalid status doesn't pass
        const statusText = capitalize(statusToString(ordersStatus, oldStatus)!);
        throw new Error(`Order with status ${statusText} isn't updatable`);
    }
}
