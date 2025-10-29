import { model } from "mongoose";

import { collections } from "@Shared";
import paymentSchema, { type IPayment } from "./schema/payment.js";

export default model<IPayment>(collections.payment, paymentSchema);
