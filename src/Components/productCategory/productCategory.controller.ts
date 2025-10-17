import type { RequestHandler } from "express";

import validate from "@/middlewares/validate.js";
import {
    paginationHandler,
    type GetDataWithPagination,
    type IQuery,
    type Pagination,
} from "@/shared/index.js";
import {
    postCategorySchema,
    productCategoryStore,
    type IProductCategory,
    type PostCategorySchema,
} from "./index.js";

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
    string | GetDataWithPagination<IProductCategory>,
    null,
    Pagination & IQuery
> = async (req, res) => {
    const query = req.query.query || "";
    const { status, data, error } = await productCategoryStore.getCategories(
        query,
        paginationHandler(req)
    );
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
