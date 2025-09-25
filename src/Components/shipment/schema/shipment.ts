import { Schema } from "mongoose";

import { reference, statusSchema } from "@/shared/index.js";
import shipmentStatus from "../shipment.status.js";
import type IShipment from "./shipment.d.js";

const shipmentSchema = new Schema<IShipment>({
    employee: { type: String, required: true },
    order: reference("Order"),
    selectedDate: { type: Date, required: true },
    deliveredAt: { type: Date, required: true },
    node: { type: String, required: true },
    status: statusSchema(shipmentStatus),
});
export default shipmentSchema;
