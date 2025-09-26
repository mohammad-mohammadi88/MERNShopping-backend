import { Schema } from "mongoose";
import type { CollectionsValue } from "./collections.js";

export default (ref: CollectionsValue, required = true, options?: object) => ({
    type: Schema.Types.ObjectId,
    required,
    ref,
    ...options,
});
