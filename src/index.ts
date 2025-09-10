import cors from "cors";
import express from "express";

import productCategoryRouter from "@P_Category/productCategory.route.js";
import usersRouter from "@Users/users.route.js";
import { defaults, mongooseConnection } from "./shared/index.js";

const app = express();

(async () => {
    // connect mongo
    await mongooseConnection.connect();

    // middleware
    app.use(cors());
    app.use(express.json());

    // routes
    app.get("/healthCheck", (_, res) => res.send("ok"));

    app.use("/users", usersRouter);
    app.use("/categories", productCategoryRouter);

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
