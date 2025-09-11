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
    const category = await productCategoryStore.addCategory(req.body);
    return res.status(typeof category === "string" ? 500 : 201).send(category);
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
    const categories = await productCategoryStore.getCategories();
    return res
        .status(typeof categories === "string" ? 500 : 200)
        .send(categories);
};

// get category by id
export const getCategoryByIdHandler: RequestHandler<
    { id: string },
    string | IProductCategory
> = async (req, res) => {
    const id = req.params.id;
    const category = await productCategoryStore.getCategoryById(id);
    const isNull = category === null;

    return res
        .status(typeof category === "string" ? 500 : isNull ? 404 : 200)
        .send(category ?? `Category with id #${id} doesn't exists!`);
};
