import type { RequestHandler } from "express";

import { validateAsync } from "@/middlewares/index.js";
import productStore, {
    type GetProducts,
    type Pagination,
} from "./products.db.js";
import {
    postProductSchema,
    type PostProductSchema,
} from "./products.validate.js";
import type IProduct from "./schema/products.d.js";

// Post Product
const postProductCTRL: RequestHandler<
    null,
    string | IProduct,
    PostProductSchema
> = async (req, res) => {
    const newProduct = await productStore.addProduct(req.body);
    const error = typeof newProduct === "string";
    return res.status(error ? 500 : 201).send(newProduct);
};
export const postProductHandler: any[] = [
    validateAsync(postProductSchema),
    postProductCTRL,
];

// Get All Products
const check = (i: number): boolean => i < 1 || !Number.isInteger(i);
export const getAllProductsHandler: RequestHandler<
    null,
    string | GetProducts,
    null,
    Pagination
> = async (req, res) => {
    let pagination: Required<Pagination> | undefined = {
        page: Number(req.query.page) ?? -1,
        perPage: Number(req.query.perPage) ?? -1,
    };
    if (check(pagination.page) || check(pagination.perPage))
        pagination = undefined;

    const products = await productStore.getProducts(pagination);
    const error = typeof products === "string";
    return res.status(error ? 500 : 200).send(products);
};

// Get Product By Id
export const getProductByIdHandler: RequestHandler<
    { id: string },
    string | IProduct
> = async (req, res) => {
    const id = req.params.id;
    const product = await productStore.getProductById(id);
    const error = typeof product === "string";
    return res
        .status(error ? 500 : !product ? 404 : 200)
        .send(product ?? `Product with id #${id} doesn't exists!`);
};
