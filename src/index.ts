import express from "express";

import { defaults, mongooseConnection } from "./shared/index.js";
import usersRouter from "@Users/users.route.js";

const app = express();

(async () => {
    // connect mongo
    await mongooseConnection.connect();

    // middleware
    app.use(express.json());

    // routes
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
