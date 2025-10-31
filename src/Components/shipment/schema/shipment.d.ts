import type { Document, Types } from "mongoose";

import type { IOrder } from "@Order/index.ts";
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

export interface FullShipment extends Omit<IShipment, "order"> {
    order: IOrder;
}
