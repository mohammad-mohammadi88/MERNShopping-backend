import { customAlphabet, urlAlphabet } from "nanoid";

const newAlphabet = urlAlphabet.replace(/[-_]/g, "");

export default customAlphabet(newAlphabet, 16);
