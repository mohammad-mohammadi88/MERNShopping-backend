import type { OrderStatusValue } from "@Order/order.status.ts";

export type OrderProcess = (
    newStatus: OrderStatusValue,
    oldStatus: OrderStatusValue
) => boolean;
export default interface StatusHandler {
    setNext: (handler: StatusHandler) => StatusHandler;
    process: OrderProcess;
}
