import { Schema } from "mongoose";

import { reference, statusSchema } from "@/shared/index.js";
import { commentRecommendation, commentStatus } from "../comment.constants.js";
import type IComment from "./comment.d.js";

const commentSchema = new Schema<IComment>(
    {
        body: { type: String, required: true },
        title: { type: String, required: true },
        user: reference("User"),
        product: reference("Product"),
        isCustomer: { type: Boolean, default: false },
        status: statusSchema(commentStatus),
        recommendation: statusSchema(commentRecommendation, "NOT_SURE"),
    },
    { timestamps: true }
);
export default commentSchema;
