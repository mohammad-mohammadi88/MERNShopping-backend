import { v2 as cloudinary } from "cloudinary";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import appRouter from "@/Components/routes.js";
import { updatePaymentStatusHandler } from "@Payment/payment.controller.js";
import { defaults, mongooseConnection } from "@Shared";

(async () => {
    const app = express();

    // healthCheck
    app.get("/healthCheck", (_, res) => res.send("ok"));

    // connect mongo
    await mongooseConnection.connect();

    // stripe webhook
    app.post("/payments/webhookSessionCheck", updatePaymentStatusHandler);

    // config cloudinary
    cloudinary.config(defaults.cloudinary);

    // middleware
    app.use(helmet());
    app.use(
        cors({
            credentials: true,
            origin(requestOrigin, callback) {
                // allow for development
                if (defaults.platform === "development")
                    return callback(null, true);

                const allowedOrigins = Object.values(defaults.frontend.domains);

                const isOriginAllowed =
                    requestOrigin && allowedOrigins.includes(requestOrigin);
                const originError = new Error("Not allowed CORS");

                if (isOriginAllowed) callback(null, true);
                else callback(originError);
            },
        })
    );
    app.use(compression());
    app.use(express.json());

    // routes
    app.use(appRouter);

    // listen
    app.listen(defaults.port, "0.0.0.0", () =>
        console.log(`server is running on http://0.0.0.0:${defaults.port}`)
    );
})().catch(async (e) => {
    console.log(e);

    // disconnect mongo
    await mongooseConnection.disconnect();

    // exit
    process.exit(1);
});
