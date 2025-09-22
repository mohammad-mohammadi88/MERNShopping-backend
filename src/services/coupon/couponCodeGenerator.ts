import defaults from "@/shared/defaults.js";
import { customAlphabet, urlAlphabet } from "nanoid";

const newAlphabet = urlAlphabet.replace(/[-_]/g, "");

export default customAlphabet(newAlphabet, defaults.couponCodeLength);
