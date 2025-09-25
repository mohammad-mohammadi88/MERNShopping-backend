const shipmentStatus = {
    PENDING: 0,
    SHIPPING: 1,
    DELIVERED: 2,
    ABSENT: 3,
} as const;
type ShipmentStatus = typeof shipmentStatus;
export type ShipmentStatusKey = keyof ShipmentStatus;
export type ShipmentStatusValue = ShipmentStatus[ShipmentStatusKey];
export default shipmentStatus;
