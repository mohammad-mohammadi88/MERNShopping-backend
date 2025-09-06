import type { RequestHandler } from "express";

import validation from "@/middlewares/validation.js";
import productCategoryStore from "./productCategory.db.js";
import {
    postCategorySchema,
    type PostSchema,
} from "./productCategory.validate.js";
import type IProductCategory from "./schema/product.category.d.js";

const postCategoryCTRL: RequestHandler<
    null,
    string | IProductCategory,
    PostSchema
> = async (req, res) => {
    const category = await productCategoryStore.addCategory(req.body);
    return res.status(typeof category === "string" ? 500 : 201).json(category);
};

export const postCategoryHandler: any[] = [
    validation(postCategorySchema),
    postCategoryCTRL,
];
