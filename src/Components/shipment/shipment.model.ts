import { model } from "mongoose";

import collections from "@/shared/collections.js";
import type IShipment from "./schema/shipment.d.js";
import shipmentSchema from "./schema/shipment.js";

export default model<IShipment>(collections.shipment, shipmentSchema);
