import { z } from "zod";

import productCategoryStore from "@P_Category/productCategory.db.js";
import { attrSchema } from "@P_Category/productCategory.validate.js";

// chech category funtionality
type CheckCategory = (id: string) => Promise<boolean>;
const checkCategoryExistence: CheckCategory = async (id) => {
    if (id.length !== 24) throw "productCategory must be 24 characters long";

    const exists = await productCategoryStore.getCategoryById(id);
    if (typeof exists === "string") throw exists;

    return !!exists;
};

// category not found message
const categoryNotFound = {
    message: "Category not found",
    path: ["productCategory"],
};

// product category field validation
const productCategory = z
    .string()
    .refine(checkCategoryExistence, categoryNotFound);

// product base schema
const price = z.preprocess((val) => {
    const num = Number(val);
    return num || undefined;
}, z.number().positive());

const attrs = z.preprocess((val) => {
    if (typeof val !== "string") return val;
    try {
        return JSON.parse(val);
    } catch {
        return undefined;
    }
}, z.array(attrSchema));

const productSchemaBase = {
    title: z.string(),
    price,
    productCategory,
    attrs,
};

// post product schema
export const postProductSchema = z.object(productSchemaBase);
export type PostProductSchema = z.infer<typeof postProductSchema>;
