import type { Document, Types } from "mongoose";

import type { PaymentStatusValue } from "../payment.status.ts";

export default interface IPayment extends Document {
    user: Types.ObjectId;
    order: Types.ObjectId;
    status: PaymentStatusValue;
    amount: number;
    stripeSessionId: string;
    paidAmount?: number;
    paymentId?: string;
    currency: string;
    createdAt: Date;
}
