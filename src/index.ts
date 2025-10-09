import appRouter from "@/Components/routes.js";
import { v2 as cloudinary } from "cloudinary";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { defaults, mongooseConnection } from "./shared/index.js";

const app = express();

(async () => {
    // connect mongo
    await mongooseConnection.connect();

    // config cloudinary
    cloudinary.config(defaults.cloudinary);

    // middleware
    app.use(helmet());
    app.use(cors());
    app.use(compression());
    app.use(express.json());

    // routes
    app.get("/healthCheck", (_, res) => res.send("ok"));
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
