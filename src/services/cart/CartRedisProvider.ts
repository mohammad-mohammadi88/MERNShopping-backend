import redisConnection from "@/shared/redis.js";
import type ProductType from "@Products/schema/products.d.js";
import type CartConfig from "./CartConfig.js";
import type CartProvider from "./CartProvider.js";

export default class CartRedisProvider implements CartProvider, CartConfig {
    key: string = "";

    public config = (key: any) => (this.key = key);

    public add = (product: ProductType): Promise<number> =>
        redisConnection.lpush(this.key, JSON.stringify(product));

    public remove = (product: ProductType): Promise<number> =>
        redisConnection.lrem(this.key, 0, JSON.stringify(product));

    public items = async (): Promise<ProductType[]> =>
        (await redisConnection.lrange(this.key, 0, -1)).map((item: string) =>
            JSON.parse(item)
        );

    public count = (): Promise<number> => redisConnection.llen(this.key);

    public clear = (): Promise<number> => redisConnection.del(this.key);

    public total = async (): Promise<number> =>
        (await this.items()).reduce((t, c) => t + c.price, 0);
}
