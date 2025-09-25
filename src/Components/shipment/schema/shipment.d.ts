import type { Document, Types } from "mongoose";
import type { ShipmentStatusValue } from "../shipment.status.ts";

export default interface IShipment extends Document {
    employee: string;
    order: Types.ObjectId;
    selectedDate: Date;
    deliveredAt: Date;
    node?: string;
    status: ShipmentStatusValue;
}
