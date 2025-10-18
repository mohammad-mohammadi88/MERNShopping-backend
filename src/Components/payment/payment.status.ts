export const paymentStatus = {
    PENDING: 0,
    SUCCESS: 1,
    FAILED: 2,
} as const;
type PaymentStatus = typeof paymentStatus;
export type PaymentStatusKey = keyof PaymentStatus;
export type PaymentStatusValue = PaymentStatus[PaymentStatusKey];
export default paymentStatus;
