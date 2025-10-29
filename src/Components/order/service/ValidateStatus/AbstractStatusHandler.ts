import type { OrderStatusValue } from "@Order/index.js";
import type StatusHandler from "./StatusHandler.js";
import type { OrderProcess } from "./StatusHandler.js";

export default abstract class AbstractStatusHandler implements StatusHandler {
    private nextHandler: StatusHandler | undefined;

    public setNext = (handler: StatusHandler): StatusHandler =>
        (this.nextHandler = handler);

    public process(
        newStatus: OrderStatusValue,
        oldStatus: OrderStatusValue
    ): OrderProcess {
        return this.nextHandler
            ? this.nextHandler?.process(newStatus, oldStatus)
            : this.process;
    }
}
