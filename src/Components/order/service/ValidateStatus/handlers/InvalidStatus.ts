import type { OrderStatusValue } from "@Order/order.status.js";
import ordersStatus from "@Order/order.status.js";
import AbstractStatusHandler from "../AbstractStatusHandler.js";

export default class InvalidStatus extends AbstractStatusHandler {
    public process(newStatus: OrderStatusValue, _: OrderStatusValue): boolean {
        const statusValues = Object.values(ordersStatus);
        if (statusValues.includes(newStatus)) return true;

        throw new Error("This order status is invalid");
    }
}
