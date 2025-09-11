import { z } from "zod";

import productCategoryStore from "@P_Category/productCategory.db.js";
import { attrSchema } from "@P_Category/productCategory.validate.js";

type CheckCategory = (id: string) => Promise<boolean>;
const checkCategoryExistence: CheckCategory = async (id) => {
    if (id.length !== 24) throw "productCategory must be 24 characters long";
    const exists = await productCategoryStore.getCategoryById(id);
    if (typeof exists === "string") throw exists;
    return !!exists;
};
const categoryNotFound = {
    message: "Category not found",
    path: ["productCategory"],
};
const productCategory = z
    .string()
    .refine(checkCategoryExistence, categoryNotFound);

const productSchemaBase = {
    title: z.string(),
    thumbnail: z.string(),
    price: z.number(),
    productCategory,
    attrs: z.array(attrSchema),
    gallery: z.array(z.string()).optional(),
};

// post product schema
export const postProductSchema = z.object(productSchemaBase);
export type PostProductSchema = z.infer<typeof postProductSchema>;

// pagination
export const paginationSchema = z
    .object({
        perPage: z.number(),
        page: z.number(),
    })
    .optional();
export type Pagination = z.infer<typeof paginationSchema>;
