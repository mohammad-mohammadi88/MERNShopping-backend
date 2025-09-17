import type { RequestHandler } from "express";
import fileUpload from "express-fileupload";

import {
    imageDestroyer,
    imageResize,
    validateAsync,
} from "@/middlewares/index.js";
import productStore, {
    type GetProducts,
    type Pagination,
} from "./products.db.js";
import {
    editProductSchema,
    postProductSchema,
    type EditProductSchema,
    type PostProductSchema,
} from "./products.validate.js";
import type IProduct from "./schema/products.d.js";

type ParamID = { id: string };
// Post Product
const postProductCTRL: RequestHandler<
    null,
    string | IProduct,
    PostProductSchema
> = async (req, res) => {
    const { status, data, error } = await productStore.addProduct({
        ...req.body,
        ...req.images,
    });
    return res.status(status).send(error || data);
};
export const postProductHandler: any[] = [
    fileUpload(),
    validateAsync(postProductSchema),
    imageResize("add"),
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

    const { status, data, error } = await productStore.getProducts(pagination);
    return res.status(status).send(error || data);
};

// Get Product By Id
export const getProductByIdHandler: RequestHandler<
    ParamID,
    string | IProduct
> = async (req, res) => {
    const id = req.params.id;
    const { status, data, error } = await productStore.getProductById(id);
    return res.status(status).send(error || data);
};

// edit Product By Id
const editProductByIdCTRL: RequestHandler<
    ParamID,
    string | IProduct,
    EditProductSchema
> = async (req, res) => {
    const { status, data, error } = await productStore.editProduct(
        req.params.id,
        {
            ...req.body,
            ...req.images,
        }
    );
    return res.status(status).send(error || data);
};
export const editProductByIdHandler: any[] = [
    fileUpload(),
    validateAsync(editProductSchema),
    imageDestroyer("edit"),
    imageResize("edit"),
    editProductByIdCTRL,
];

// delete product by id
const deleteProductByIdCTRL: RequestHandler<
    ParamID,
    string | IProduct
> = async (req, res) => {
    const { status, data, error } = await productStore.deleteProduct(
        req.params.id
    );
    return res.status(status).send(error || data);
};
export const deleteProductByIdHandler: any[] = [
    imageDestroyer("delete"),
    deleteProductByIdCTRL,
];
