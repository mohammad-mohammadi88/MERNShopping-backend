import type { Images } from "@/request.js";
import {
    errorHandler,
    paginateData,
    pipelines,
    searchAggretion,
    type Pagination,
} from "@/shared/index.js";
import {
    productModel,
    type EditProductSchema,
    type IProduct,
    type PostProductSchema,
} from "./index.js";

class ProductStore {
    getProducts = (query: string, pagination?: Required<Pagination>) =>
        paginateData<IProduct>(
            () => this.searchData(query) as any,
            "products",
            pagination
        );

    private searchData = (query: string) => {
        const productFields = pipelines.product.searchFields;
        const pipeline = searchAggretion(
            pipelines.product.pipeline,
            productFields,
            query
        );
        return productModel.aggregate(pipeline);
    };

    addProduct = (data: PostProductSchema & Images) =>
        errorHandler(() => productModel.create(data), "creating new product", {
            successStatus: 201,
        });

    getProductById = (id: string) =>
        errorHandler(
            () => productModel.findById(id).populate(["productCategory"]),
            "getting product by id",
            {
                notFoundError: `Product with id #${id} not found`,
            }
        );

    changeProductQuantity = (_id: string, quantityEffect: number) => {
        const action = quantityEffect > 0 ? "increas" : "decreas";
        const $gte = quantityEffect > 0 ? -1 : Math.abs(quantityEffect);
        return errorHandler(
            async () =>
                await productModel.findOneAndUpdate(
                    { _id, quantity: { $gte } },
                    { $inc: { quantity: quantityEffect } }
                ),
            `${action}ing product quantity with id #${_id}`,
            {
                notFoundError: `Unable to ${action}e product with id #${_id} quantity`,
            }
        );
    };

    editProduct = (id: string, data: EditProductSchema & Images) =>
        errorHandler(
            () => productModel.findByIdAndUpdate(id, data),
            "editing product",
            { notFoundError: `Product with id #${id} not found` }
        );

    deleteProduct = (id: string) =>
        errorHandler(
            () => productModel.findByIdAndDelete(id),
            "deleting product",
            { notFoundError: `Product with id #${id} not found` }
        );
}

export default new ProductStore();
