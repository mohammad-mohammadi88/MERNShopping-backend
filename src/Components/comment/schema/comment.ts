import { Schema } from "mongoose";

import { reference, statusSchema } from "@Shared";
import { commentRecommendation, commentStatus } from "../comment.constants.js";
import type IComment from "./comment.d.js";

export { type IComment };
const commentSchema = new Schema<IComment>(
    {
        body: { type: String, required: true },
        title: { type: String, required: true },
        user: reference("User"),
        product: reference("Product"),
        status: statusSchema(commentStatus),
        recommendation: statusSchema(commentRecommendation, "NOT_SURE"),
    },
    { timestamps: true }
);
export default commentSchema;
