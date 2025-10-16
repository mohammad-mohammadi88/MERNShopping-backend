import type { OrderStatusValue } from "@Order/order.status.js";
import ordersStatus from "@Order/order.status.js";
import AbstractStatusHandler from "../AbstractStatusHandler.js";

export default class InitNotToCanceled extends AbstractStatusHandler {
    public process(
        newStatus: OrderStatusValue,
        oldStatus: OrderStatusValue
    ): boolean {
        if (
            oldStatus === ordersStatus.INIT &&
            newStatus === ordersStatus.CANCELED
        )
            return true;

        throw new Error("Order in status Init can only be Paid or Canceled");
    }
}
