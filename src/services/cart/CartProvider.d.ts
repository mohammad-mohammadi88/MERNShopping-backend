export default interface CartProvider {
    add: (product: ProductType) => any;
    remove: (product: ProductType) => any;
    items: () => any;
    count: () => any;
    clear: () => any;
    total: () => any;
}
