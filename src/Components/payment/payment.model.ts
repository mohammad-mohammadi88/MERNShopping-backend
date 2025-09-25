import { model } from "mongoose";

import collections from "@/shared/collections.js";
import paymentSchema from "./schema/payment.js";

export default model(collections.payment, paymentSchema);
