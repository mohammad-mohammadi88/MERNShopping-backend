import mongoose from "mongoose";
import { styleText } from "node:util";

import defaults from "./defaults.js";

const connect = () =>
    mongoose.connect(defaults.databaseUrl).then(
        () =>
            console.log(styleText("greenBright", "\nDatabase is Connected\n")),
        (e) =>
            console.log(
                styleText(
                    "redBright",
                    "There is a problem with database connecion: "
                ),
                e
            )
    );
const disconnect = () => mongoose.disconnect();

export default { connect, disconnect };
