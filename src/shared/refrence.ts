import { Schema } from "mongoose";

export default (ref: string) => ({
    type: Schema.Types.ObjectId,
    required: true,
    ref,
});
