export const productsStatus = {
    INIT: 0,
    INACTIVE: 1,
    PUBLISHED: 2,
} as const;
type ProductStatus = typeof productsStatus;
export type ProductStatusKey = keyof ProductStatus;
export type ProductStatusValue = ProductStatus[ProductStatusKey];
export default productsStatus;
