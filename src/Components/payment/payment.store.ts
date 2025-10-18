import errorHandler from "@/shared/errorHandler.js";
import { paymentModel, type PaymentStatusValue } from "./index.js";

interface NewPaymentData {
    order: string;
    amount: number;
    stripeSessionId: string;
    currency: string;
}
class PaymentStore {
    addNewPayment = (data: NewPaymentData) =>
        errorHandler(() => paymentModel.create(data), "creating payment", {
            successStatus: 201,
        });

    updatePaymentStatus = (
        id: string,
        newStatus: Exclude<PaymentStatusValue, 0>
    ) =>
        errorHandler(
            () => paymentModel.findByIdAndUpdate(id, { status: newStatus }),
            "updating payment",
            { notFoundError: `This payment doesn't exists` }
        );
}
export default new PaymentStore();
