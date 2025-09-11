import type { RequestHandler } from "express";

import { validate, validateAsync } from "@/middlewares/index.js";
import productStore, { type GetProducts } from "./products.db.js";
import {
    paginationSchema,
    postProductSchema,
    type Pagination,
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
const getAllProductsCTRL: RequestHandler<
    null,
    string | GetProducts,
    Pagination
> = async (req, res) => {
    const products = await productStore.getProducts(req.body);
    const error = typeof products === "string";
    return res.status(error ? 500 : 200).send(products);
};
export const getAllProductsHandler: any[] = [
    validate(paginationSchema),
    getAllProductsCTRL,
];

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
