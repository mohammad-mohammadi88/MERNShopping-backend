import ordersStatus, { type OrderStatusValue } from "@Order/order.status.js";
import AbstractStatusHandler from "../AbstractStatusHandler.js";

export default class InvalidStatus extends AbstractStatusHandler {
    public process(newStatus: OrderStatusValue, oldStatus: OrderStatusValue) {
        const statusValues = Object.values(ordersStatus);
        if (statusValues.includes(newStatus))
            return super["process"](newStatus, oldStatus);

        throw new Error("This order status is invalid");
    }
}
