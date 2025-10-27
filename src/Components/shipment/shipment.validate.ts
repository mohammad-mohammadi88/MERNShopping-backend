import z from "zod";

import shipmentStatus, { type ShipmentStatusValue } from "./shipment.status.js";

// add shipment
const selectedDate = z.preprocess((val) => {
    if (typeof val === "string" || typeof val === "number") {
        const d = new Date(val);
        if (!isNaN(d.getTime())) return d;
    }
    return val;
}, z.date());
export const addShipmentSchema = z.object({
    order: z.string().length(24, "Order id should be 24 characters long"),
    selectedDate,
    note: z.string().optional(),
});
export type AddShipmentSchema = z.infer<typeof addShipmentSchema>;

// edit shipment status
const invalidStatusError = {
    error: `Shipment status can only be one of ${Object.values(
        shipmentStatus
    ).join(", ")} values`,
    path: ["status"],
};
const statusValidator = (status: number): boolean =>
    (Object.values(shipmentStatus) as number[]).includes(status);
export const editShipmentStatusSchema = z.object({
    status: z.number().refine(statusValidator, invalidStatusError),
});
export type EditShipmentStatusSchema = { status: ShipmentStatusValue };
