import { z } from "zod";

import { productSchema } from "@Shared";
import { commentRecommendation, commentStatus } from "./comment.constants.js";

// add comment
const product = productSchema;
const title = z.string();
const body = z.string();
const recommendation = z.any().superRefine(async (val: unknown, ctx) => {
    if (val === undefined) return ctx.addIssue("recommendation is required");
    if (!Object.values(commentRecommendation).includes(val as any))
        return ctx.addIssue("Invalid recommendation");
});
export const addCommentSchema = z.object({
    body,
    product,
    recommendation,
    title,
});
export type AddCommentSchema = z.infer<typeof addCommentSchema>;

// update comment
const status = z.any().superRefine(async (val: unknown, ctx) => {
    if (val === undefined) return ctx.addIssue("status is required");
    if (!Object.values(commentStatus).includes(val as any))
        return ctx.addIssue("Invalid status");
});
export const updateCommentStatusSchema = z.object({ status });
export type UpdateCommentStatusSchema = z.infer<
    typeof updateCommentStatusSchema
>;
