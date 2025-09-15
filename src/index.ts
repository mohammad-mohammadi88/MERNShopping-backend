import { v2 as cloudinary } from "cloudinary";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import {
    couponRouter,
    ordersRouter,
    productCategoryRouter,
    productOffersRouter,
    productsRouter,
    usersRouter,
} from "@/Components/routes.js";

import { defaults, mongooseConnection } from "./shared/index.js";

const app = express();

(async () => {
    // connect mongo
    await mongooseConnection.connect();

    // config cloudinary
    cloudinary.config(defaults.cloudinary);

    // middleware
    app.use(cors());
    app.use(compression());
    app.use(helmet());
    app.use(express.json());

    // routes
    app.get("/healthCheck", (_, res) => res.send("ok"));

    app.use("/categories", productCategoryRouter);
    app.use("/coupon", couponRouter);
    app.use("/offers", productOffersRouter);
    app.use("/orders", ordersRouter);
    app.use("/products", productsRouter);
    app.use("/users", usersRouter);

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
