import type { RequestHandler } from "express";
import fileUpload from "express-fileupload";

import {
    imageDestroyer,
    imageResize,
    validateAsync,
} from "@/middlewares/index.js";
import productCategoryStore from "@P_Category/productCategory.store.js";
import productStore, {
    type GetProducts,
    type Pagination,
} from "./product.store.js";
import {
    editProductSchema,
    postProductSchema,
    type EditProductSchema,
    type PostProductSchema,
} from "./product.validate.js";
import type IProduct from "./schema/product.d.js";

type ParamID = { id: string };
// Post Product
const postProductCTRL: RequestHandler<
    null,
    string | IProduct,
    PostProductSchema
> = async (req, res) => {
    const { status: categoryStatus, error: categoryError } =
        // default action is increase
        await productCategoryStore.changeProductCount(
            req.body.productCategory as unknown as string
        );
    if (categoryError) return res.status(categoryStatus).send(categoryError);

    const { status, data, error } = await productStore.addProduct({
        ...req.body,
        ...req.images,
    });
    if (error) return res.status(status).send(error);

    return res.status(status).send(data);
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
type ChangeCountResponse =
    | undefined
    | {
          status: number;
          error: string;
      };
type ChangeCountFn = (
    prevCategoryId: string,
    nextCategoryId: string
) => Promise<ChangeCountResponse>;
const changeProductCounts: ChangeCountFn = async (
    prevCategoryId,
    nextCategoryId
) => {
    const errorCreator = (
        status: number,
        error: string
    ): ChangeCountResponse => ({ status, error });

    // decrease prev productCategory.productCount
    const { status: decreaseStatus, error: decreaseError } =
        await productCategoryStore.changeProductCount(
            prevCategoryId,
            "decrease"
        );
    if (decreaseError) return errorCreator(decreaseStatus, decreaseError);

    // increase prev productCategory.productCount
    const { status: increaseStatus, error: increaseError } =
        await productCategoryStore.changeProductCount(nextCategoryId);
    if (increaseError) return errorCreator(increaseStatus, increaseError);
};

const editProductByIdCTRL: RequestHandler<
    ParamID,
    string | IProduct,
    EditProductSchema
> = async (req, res) => {
    const prevProduct = req.prevProduct!;
    const prevCategoryId = prevProduct.productCategory as unknown as string;
    const nextCategoryId = req.body.productCategory;

    // handle productCategory.productCount
    if (prevCategoryId !== nextCategoryId) {
        const result = await changeProductCounts(
            prevCategoryId,
            nextCategoryId
        );
        // error handling
        if (result) return res.status(result.status).send(result.error);
    }
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
    const id = req.params.id;
    const { status, error, data } = await productStore.deleteProduct(id);
    if (error) return res.status(status).send(error);

    const { status: categoryStatus, error: categoryError } =
        await productCategoryStore.changeProductCount(
            data?.productCategory as unknown as string,
            "decrease"
        );
    if (categoryError) return res.status(categoryStatus).send(categoryError);

    return res
        .status(status)
        .send(`Product with id #${id} deleted successfully`);
};
export const deleteProductByIdHandler: any[] = [
    imageDestroyer("delete"),
    deleteProductByIdCTRL,
];
