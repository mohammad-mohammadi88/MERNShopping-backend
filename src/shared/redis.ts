import { Tedis } from "tedis";
import defaults from "./defaults.js";

export default new Tedis(defaults.redis);
