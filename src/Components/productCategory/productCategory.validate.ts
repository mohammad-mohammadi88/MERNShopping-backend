import { z } from "zod";

z.setErrorMap((issue) => {
    switch (issue.code) {
        case "invalid_type":
            return {
                message: `${issue?.path?.join(".") || "field"} must be ${
                    issue.expected
                }, but got ${issue.received}`,
            };
        case "too_small":
            return {
                message: `${issue?.path?.join(".") || "field"} is required`,
            };
        default:
            return { message: issue.message || "" };
    }
});

const title = z.string();

const boolean = z.boolean().optional();
const attr = z.object({
    title,
    description: title,
    filterable: boolean,
    isMultiple: boolean,
});

const attrGroup = z.object({
    title,
    attrs: z.array(attr),
});

// post Category Schema
export const postCategorySchema = z.object({
    title,
    attrs: z.array(attrGroup),
});
export type PostSchema = z.infer<typeof postCategorySchema>;
