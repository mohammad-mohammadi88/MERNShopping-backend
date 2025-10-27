import { model } from "mongoose";

import { collections } from "@Shared";
import shipmentSchema, { type IShipment } from "./schema/shipment.js";

export default model<IShipment>(collections.shipment, shipmentSchema);
