import "dotenv/config";
const mainSiteDomain = process.env.MAIN_SITE_DOMAIN!;
const adminSiteDomain = process.env.ADMIN_SITE_DOMAIN!;

type Platform = "development" | "production";
const platform = process.env.NODE_ENV! as Platform;

export default {
    cloudinaryFolder: "mernShopping",
    maxGalleryLength: 3,
    couponCodeLength: 16,
    platform,
    port: Number(process.env.PORT!),
    databaseUrl: process.env.DATABASE_URL!,
    jwtPrivate: process.env.JWT_PRIVATE!,
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
    stripe: {
        stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
        stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    },
    frontend: {
        domains: {
            mainSiteDomain,
            adminSiteDomain,
        },
        success_url: `${mainSiteDomain}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${mainSiteDomain}/cancel`,
    },
};
