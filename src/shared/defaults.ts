import "dotenv/config";
export default {
    port: Number(process.env.PORT!),
    databaseUrl: process.env.DATABASE_URL!,
    redis: {
        password: process.env.REDIS_PASSWORD!,
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT!),
    },
};
