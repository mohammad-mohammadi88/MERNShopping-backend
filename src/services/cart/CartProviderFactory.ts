import CartMemoryProvider from "./CartMemoryProvider.js";
import type CartProvider from "./CartProvider.d.js";

export default class CartProviderFactore {
    private providers: Map<string, CartProvider> = new Map<
        string,
        CartProvider
    >();

    constructor() {
        this.providers.set("memory", new CartMemoryProvider());
    }

    public setProvider = this.providers.set;

    public getProvider = (name: string): CartProvider => {
        const provider = this.providers.get(name);
        if (!provider) throw new Error(`Provider ${name} doesn't exists`);
        return provider;
    };

    public has = (name: string): boolean => this.providers.has(name);
}
