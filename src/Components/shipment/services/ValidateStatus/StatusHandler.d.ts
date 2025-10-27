import type { ShipmentStatusValue } from "@Shipment/index.js";

export type ShipmentProcess = (
    newStatus: ShipmentStatusValue,
    oldStatus: ShipmentStatusValue
) => ShipmentProcess;
export default interface StatusHandler {
    setNext: (handler: StatusHandler) => StatusHandler;
    process: ShipmentProcess;
}
