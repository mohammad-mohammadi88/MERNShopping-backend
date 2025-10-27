import type { Document, Types } from "mongoose";

import type { ShipmentStatusValue } from "../shipment.status.ts";

export default interface IShipment extends Document {
    user: Types.ObjectId;
    order: Types.ObjectId;
    selectedDate: Date;
    deliveredAt: Date;
    note?: string;
    status: ShipmentStatusValue;
    createdAt: Date;
    updatedAt: Date;
}
