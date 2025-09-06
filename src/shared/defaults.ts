import "dotenv/config";
export default {
    port: Number(process.env.PORT!),
    databaseUrl: process.env.DATABASE_URL!,
    redisPassword: process.env.REDIS_PASSWORD!,
    redisHost: process.env.REDIS_HOST!,
    redisPort: Number(process.env.REDIS_PORT!),
};
