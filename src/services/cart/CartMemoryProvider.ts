import type IProduct from "@Products/schema/products.d.js";
import type CartProvider from "./CartProvider.d.js";

export default class CartMemoryProvider implements CartProvider {
    cartItems: IProduct[] = [];
    public add = (product: IProduct): number => this.cartItems.push(product);

    public remove = (product: IProduct) =>
        this.has(product) &&
        this.cartItems.splice(this.cartItems.indexOf(product), 1);

    public items = (): IProduct[] => this.cartItems;

    public count = (): number => this.cartItems.length;

    private has = (product: IProduct): boolean =>
        this.cartItems.includes(product);

    public clear = (): never[] => (this.cartItems = []);

    public total = (): number =>
        this.cartItems.reduce((total, current) => total + current.price, 0);
}
