import type { Document, Types } from "mongoose";

import type { IOrder } from "@Order/index.ts";
import type { IUser } from "@User/index.ts";
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

export interface FullPayment extends Omit<IPayment, "order" | "user"> {
    user: IUser;
    order: IOrder;
}
