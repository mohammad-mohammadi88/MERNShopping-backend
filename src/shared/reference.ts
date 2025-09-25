import { Schema } from "mongoose";
import type collections from "./collections.js";

export type Collections = keyof typeof collections;

export default (ref: Collections, required = true, options?: object) => ({
    type: Schema.Types.ObjectId,
    required,
    ref,
    ...options,
});
