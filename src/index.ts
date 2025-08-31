import express from "express";

import defaults from "./contracts/defaults.js";
import mongooseConnection from "./contracts/mongoose.connection.js";

const app = express();

(async () => {
    // connect mongo
    await mongooseConnection.connect();

    // middleware
    app.use(express.json());

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
