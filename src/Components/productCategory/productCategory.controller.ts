import type { RequestHandler } from "express";

import validate from "@/middlewares/validate.js";
import productCategoryStore from "./productCategory.db.js";
import {
    postCategorySchema,
    type PostCategorySchema,
} from "./productCategory.validate.js";
import type IProductCategory from "./schema/product.category.d.js";

// post category
const postCategoryCTRL: RequestHandler<
    null,
    string | IProductCategory,
    PostCategorySchema
> = async (req, res) => {
    const { status, data, error } = await productCategoryStore.addCategory(
        req.body
    );
    return res.status(status).send(error || data);
};

export const postCategoryHandler: any[] = [
    validate(postCategorySchema),
    postCategoryCTRL,
];

// get categories
export const getCategoriesHandler: RequestHandler<
    null,
    string | IProductCategory[]
> = async (_, res) => {
    const { status, data, error } = await productCategoryStore.getCategories();
    return res.status(status).send(error || data);
};

// get category by id
export const getCategoryByIdHandler: RequestHandler<
    { id: string },
    string | IProductCategory
> = async (req, res) => {
    const id = req.params.id;
    const { status, data, error } = await productCategoryStore.getCategoryById(
        id
    );
    return res.status(status).send(error || data);
};
