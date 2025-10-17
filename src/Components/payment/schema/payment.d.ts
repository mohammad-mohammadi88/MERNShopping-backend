import type { Document, Types } from "mongoose";
import type { PaymentStatusValue } from "../payment.status.ts";

export default interface IPayment extends Document {
    amount: number;
    createdAt: Date;
    isOnline: boolean;
    order: Types.ObjectId;
    reference: string;
    reserve: string;
    status: PaymentStatusValue;
    updatedAt: Date;
    user: Types.ObjectId;
}
