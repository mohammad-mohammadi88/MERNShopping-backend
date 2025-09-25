import { model } from "mongoose";
import paymentSchema from "./schema/payment.js";

export default model("Payment", paymentSchema);
