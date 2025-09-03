import type ProductType from "@Products/schema/products.d.js";

export default class CartMemoryProvider {
    private cartItems: ProductType[] = [];
    public add = (product: ProductType): number => this.cartItems.push(product);

    public remove = (product: ProductType) =>
        this.has(product) &&
        this.cartItems.splice(this.cartItems.indexOf(product), 1);

    public items = (): ProductType[] => this.cartItems;

    public count = (): number => this.cartItems.length;

    private has = (product: ProductType): boolean =>
        this.cartItems.includes(product);

    public clear = (): never[] => (this.cartItems = []);

    public total = (): number =>
        this.cartItems.reduce((total, current) => total + current.price, 0);
}
