import type { OrderStatusValue } from "@/Components/order/order.status.js";
import AbstractStatusHandler from "../AbstractStatusHandler.js";

export default class SameStatus extends AbstractStatusHandler {
    public process(newStatus: OrderStatusValue, oldStatus: OrderStatusValue) {
        if (newStatus !== oldStatus)
            return super["process"](newStatus, oldStatus);

        throw new Error("You don't need to update status to the same status");
    }
}
