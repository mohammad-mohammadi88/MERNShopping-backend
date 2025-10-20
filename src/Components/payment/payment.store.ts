import errorHandler from "@/shared/errorHandler.js";
import { paymentModel, type PaymentStatusValue } from "./index.js";

export interface NewPaymentData {
    order: string;
    amount: number;
    stripeSessionId: string;
    currency: string;
}
export interface UpdatePaymentData {
    paidAmount?: number;
    paymentId?: string;
    status: Exclude<PaymentStatusValue, 0>;
}
class PaymentStore {
    addNewPayment = (data: NewPaymentData) =>
        errorHandler(() => paymentModel.create(data), "creating payment", {
            successStatus: 201,
        });

    updatePayment = (order: string, data: UpdatePaymentData) =>
        errorHandler(
            () => paymentModel.findOneAndUpdate({ order }, data),
            "updating payment",
            { notFoundError: `This payment doesn't exists` }
        );
}
export default new PaymentStore();
