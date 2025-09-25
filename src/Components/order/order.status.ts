const ordersStatus = {
    INIT: 0,
    PAID: 1,
    PROCESSING: 2,
    READY: 3,
    SHIPPING: 4,
    RECEIVED: 5,
    CANCELED: 6,
} as const;
type OrderStatus = typeof ordersStatus;
export type OrderStatusKey = keyof OrderStatus;
export type OrderStatusValue = OrderStatus[OrderStatusKey];
export default ordersStatus;
