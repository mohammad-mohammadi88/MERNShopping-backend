import type { RequestHandler } from "express";

import imageDestroyer from "@/middlewares/imageDestroyer.js";
import imageResize from "@/middlewares/imageResize.js";
import validateAsync from "@/middlewares/validateAsync.js";
import fileUpload from "express-fileupload";
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
    console.log("third");
    const newProduct = await productStore.addProduct({
        ...req.body,
        ...req.images,
    });
    console.log("fourth");
    const error = typeof newProduct === "string";
    return res.status(error ? 500 : 201).send(newProduct);
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

    const products = await productStore.getProducts(pagination);
    const error = typeof products === "string";
    return res.status(error ? 500 : 200).send(products);
};

// Get Product By Id
export const getProductByIdHandler: RequestHandler<
    ParamID,
    string | IProduct
> = async (req, res) => {
    const id = req.params.id;
    const product = await productStore.getProductById(id);
    const error = typeof product === "string";
    return res
        .status(error ? 500 : !product ? 404 : 200)
        .send(product ?? `Product with id #${id} doesn't exists!`);
};

// edit Product By Id
const editProductByIdCTRL: RequestHandler<
    ParamID,
    string | IProduct,
    EditProductSchema
> = async (req, res) => {
    const editedProduct = await productStore.editProduct(req.params.id, {
        ...req.body,
        ...req.images,
    });
    // because of imageDestroyer middleware will are sure that the product already exists
    if (editedProduct === null) return;
    const error = typeof editedProduct === "string";
    return res.status(error ? 500 : 200).send(editedProduct);
};
export const editProductByIdHandler: any[] = [
    fileUpload(),
    validateAsync(editProductSchema),
    imageDestroyer("edit"),
    imageResize("edit"),
    editProductByIdCTRL,
];

// delete product by id
const deleteProductByIdCTRL: RequestHandler<ParamID, string> = async (
    req,
    res
) => {
    const id = req.params.id;
    const deletedProduct = await productStore.deleteProduct(id);
    // because of imageDestroyer middleware will are sure that the product already exists
    if (deletedProduct === null) return;
    if (typeof deletedProduct === "string")
        return res.status(500).send(deletedProduct);
    return res.status(200).send(`Product with id #${id} deleted successfully`);
};
export const deleteProductByIdHandler: any[] = [
    imageDestroyer("delete"),
    deleteProductByIdCTRL,
];
