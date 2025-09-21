import { z } from "zod";

import productCategoryStore from "@P_Category/productCategory.db.js";
import productsStatus from "./products.status.js";

// chech category funtionality
type CheckCategory = (id: string) => Promise<boolean>;
const checkCategoryExistence: CheckCategory = async (id) => {
    if (id.length !== 24) throw "productCategory must be 24 characters long";

    const exists = await productCategoryStore.getCategoryById(id);
    if (typeof exists === "string") throw exists;

    return !!exists;
};

// number schema for formdata
const number = (schema: z.core.SomeType = z.number().positive()) =>
    z.preprocess((val) => {
        const num = Number(val);
        return isNaN(num) ? undefined : num;
    }, schema);

// product attribute schema
const attrSchema = z.object({
    title: z.string(),
    description: z.string(),
});

// product color schema
const colorSchema = z.object({
    title: z.string(),
    color: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Invalid hex color"),
    priceEffect: number(z.number().nonnegative().optional()),
});

// category not found message
const categoryNotFound = {
    error: "Category not found",
    path: ["productCategory"],
};

// product category field validation
const productCategory = z
    .string()
    .refine(checkCategoryExistence, categoryNotFound);

const array = (schema: z.core.SomeType) =>
    z.preprocess((val) => {
        if (typeof val !== "string") return val;
        try {
            return JSON.parse(val);
        } catch {
            return undefined;
        }
    }, schema);

const productSchemaBase = {
    title: z.string(),
    price: number(),
    quantity: number(
        z.number().nonnegative().int("quantity cannot be flout").optional()
    ),
    productCategory,
    attrs: array(z.array(attrSchema).optional()),
    colors: array(z.array(colorSchema).optional()),
};

// post product schema
export const postProductSchema = z.object(productSchemaBase);
export type PostProductSchema = z.infer<typeof postProductSchema>;

// edit product schema
export const editProductSchema = z.object({
    ...productSchemaBase,
    salePrice: number(),
    status: number(
        z
            .number()
            .refine(
                (value) => Object.values(productsStatus).includes(value as any),
                {
                    path: ["status"],
                    error: "Product Status is invalid",
                }
            )
    ),
});
export type EditProductSchema = z.infer<typeof editProductSchema>;
