import type { Images } from "@/services/cloudinary/request.js";
import {
    type GetDataWithPagination,
    type Pagination,
    errorHandler,
} from "@/shared/index.js";
import ProductModel from "./product.model.js";
import type {
    EditProductSchema,
    PostProductSchema,
} from "./product.validate.js";
import type IProduct from "./schema/product.d.js";

class ProductStore {
    addProduct = (data: PostProductSchema & Images) =>
        errorHandler(() => ProductModel.create(data), "creating new product", {
            successStatus: 201,
        });

    getProductById = (id: string) =>
        errorHandler(() => ProductModel.findById(id), "getting product by id", {
            notFoundError: `Product with id #${id} not found`,
        });

    changeProductQuantity = (_id: string, quantityEffect: number) => {
        const action = quantityEffect > 0 ? "increas" : "decreas";
        return errorHandler(
            async () =>
                await ProductModel.findOneAndUpdate(
                    {
                        _id,
                        quantity: {
                            $gte:
                                quantityEffect > 0
                                    ? -1
                                    : Math.abs(quantityEffect),
                        },
                    },
                    { $inc: { quantity: quantityEffect } }
                ),
            `${action}ing product quantity with id #${_id}`,
            {
                notFoundError: `Unable to ${action}e product with id #${_id} quantity`,
            }
        );
    };

    getProducts = (pagination?: Required<Pagination>) =>
        errorHandler(async (): Promise<GetDataWithPagination<IProduct>> => {
            const result = ProductModel.find();
            const totalDocs = await ProductModel.countDocuments();
            if (!pagination)
                return {
                    currentPage: 1,
                    perPage: totalDocs,
                    pages: 1,
                    data: (await result) as unknown as IProduct[],
                };

            const { page, perPage } = pagination;
            const pages = Math.ceil(totalDocs / perPage);
            const currentPage = pages === 0 ? 1 : Math.min(page, pages);
            const skip = (currentPage - 1) * perPage;
            const data = (await result
                .skip(skip)
                .limit(perPage)) as unknown as IProduct[];

            return { pages, perPage, currentPage, data };
        }, "getting products");

    editProduct = (id: string, data: EditProductSchema & Images) =>
        errorHandler(
            () => ProductModel.findByIdAndUpdate(id, data),
            "editing product",
            { notFoundError: `Product with id #${id} not found` }
        );

    deleteProduct = (id: string) =>
        errorHandler(
            () => ProductModel.findByIdAndDelete(id),
            "deleting product",
            { notFoundError: `Product with id #${id} not found` }
        );
}

export default new ProductStore();
