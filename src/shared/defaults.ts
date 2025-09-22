import "dotenv/config";
export default {
    cloudinaryFolder: "mernShopping",
    maxGalleryLength: 3,
    couponCodeLength: 16,
    port: Number(process.env.PORT!),
    databaseUrl: process.env.DATABASE_URL!,
    redis: {
        password: process.env.REDIS_PASSWORD!,
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT!),
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
        api_secret: process.env.CLOUDINARY_API_SECRET!,
        api_key: process.env.CLOUDINARY_API_KEY!,
    },
};
