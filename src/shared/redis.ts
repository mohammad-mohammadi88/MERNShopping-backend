import { Tedis } from "tedis";
import defaults from "./defaults.js";

const config: { host: string; port: number; password?: string } = {
    host: defaults.redisHost,
    port: defaults.redisPort,
};
if (defaults.redisPassword) config.password = defaults.redisPassword;

const redisConnection = new Tedis(config);

export default redisConnection;
