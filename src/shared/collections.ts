export const collections = {
    comment: "Comment",
    coupon: "Coupon",
    order: "Order",
    payment: "Payment",
    product: "Product",
    productCategory: "ProductCategory",
    productOffer: "ProductOffer",
    setting: "Setting",
    shipment: "Shipment",
    user: "User",
} as const;
type Collections = typeof collections;
export type CollectionsKey = keyof Collections;
export type CollectionsValue = Collections[CollectionsKey];
export default collections;
