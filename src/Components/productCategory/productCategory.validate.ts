import { z } from "zod";

const title = z.string();

const boolean = z.boolean().optional();
const attr = z.object({
    title,
    description: title,
    filterable: boolean,
    hasPrice: boolean,
});

const attrGroup = z.object({
    title,
    attrs: z.array(attr),
});

// post Category Schema
export const postCategorySchema = z.object({
    title,
    attrGroups: z.array(attrGroup),
});
export type PostSchema = z.infer<typeof postCategorySchema>;
