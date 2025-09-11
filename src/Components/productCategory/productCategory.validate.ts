import { z } from "zod";

const title = z.string();

const boolean = z.boolean().optional();
export const attrSchema = z.object({
    title,
    description: title,
    filterable: boolean,
    hasPrice: boolean,
});

const categoryAttrGroupSchema = z.object({
    title,
    attrs: z.array(attrSchema),
});

// post Category Schema
export const postCategorySchema = z.object({
    title,
    attrGroups: z.array(categoryAttrGroupSchema),
});
export type PostCategorySchema = z.infer<typeof postCategorySchema>;
