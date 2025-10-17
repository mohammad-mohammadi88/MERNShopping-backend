import "dotenv/config";
const frontendDomain = process.env.FRONTEND_DOMAIN!;

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
    stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
    frontend: {
        domain: frontendDomain,
        success_url: `${frontendDomain}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendDomain}/cancel`,
    },
};
