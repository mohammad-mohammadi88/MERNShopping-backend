import redisConnection from "@/shared/redis.js";
import type ProductType from "@Products/schema/products.d.js";

export default class CartRedisProvider {
    constructor(private key: string) {
        console.log(this.key);
    }

    public add = (product: ProductType): Promise<number> =>
        redisConnection.lpush(this.key, JSON.stringify(product));

    public remove = async (product: ProductType): Promise<number> =>
        redisConnection.lrem(this.key, 0, JSON.stringify(product));

    public items = () =>
        redisConnection
            .lrange(this.key, 0, -1)
            .then((res) => res.map((item: string) => JSON.parse(item)));

    public count = (): Promise<number> => redisConnection.llen(this.key);

    public clear = (): Promise<number> => redisConnection.del(this.key);

    public total = (): Promise<number> =>
        this.items().then((res) =>
            res.reduce((total, current) => total + current.price, 0)
        );
}
