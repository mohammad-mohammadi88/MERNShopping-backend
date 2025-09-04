import type IProduct from "@Products/schema/products";

export default interface CartProvider {
    add: (product: IProduct) => any;
    remove: (product: IProduct) => any;
    items: () => any;
    count: () => any;
    clear: () => any;
    total: () => any;
}
