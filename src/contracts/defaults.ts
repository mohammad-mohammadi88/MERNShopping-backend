import "dotenv/config";
export default {
    port: Number(process.env.PORT!),
    databaseUrl: process.env.DATABASE_URL!,
};
