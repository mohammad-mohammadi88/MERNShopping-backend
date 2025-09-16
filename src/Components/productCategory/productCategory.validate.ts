import { z } from "zod";

const title = z.string();

const categoryAttrGroupSchema = z.object({
    title,
    attrs: z.array(z.string()),
});

// post Category Schema
export const postCategorySchema = z.object({
    title,
    attrGroups: z.array(categoryAttrGroupSchema),
});
export type PostCategorySchema = z.infer<typeof postCategorySchema>;
