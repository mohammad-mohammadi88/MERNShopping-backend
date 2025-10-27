import ordersStatus, { type OrderStatusValue } from "@Order/order.status.js";
import AbstractStatusHandler from "../AbstractStatusHandler.js";

export default class OtherToInit extends AbstractStatusHandler {
    public process(newStatus: OrderStatusValue, oldStatus: OrderStatusValue) {
        if (newStatus !== ordersStatus.INIT)
            return super["process"](newStatus, oldStatus);

        throw new Error("You can't comeback to status Init");
    }
}
