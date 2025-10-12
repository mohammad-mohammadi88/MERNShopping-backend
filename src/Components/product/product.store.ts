import type { Images } from "@/services/cloudinary/request.js";
import {
    type GetDataFns,
    type Pagination,
    errorHandler,
    paginateData,
    searchFields,
} from "@/shared/index.js";
import type { PipelineStage } from "mongoose";
import productModel from "./product.model.js";
import type {
    EditProductSchema,
    PostProductSchema,
} from "./product.validate.js";
import type IProduct from "./schema/product.d.js";

class ProductStore {
    private getterFns = (query: string): GetDataFns<IProduct> => ({
        getDataFn: () => this.searchData(query) as any,
        getCountFn: () => productModel.countDocuments(),
    });

    getProducts = (query: string, pagination?: Required<Pagination>) =>
        paginateData<IProduct>(this.getterFns(query), "coupon", pagination);

    private searchData = (query: string) => {
        const userFields = [
            "title",
            "productCategory.title",
            "attrs.title",
            "attrs.description",
        ];
        const pipeline: PipelineStage[] = [
            {
                $lookup: {
                    from: "productcategories",
                    localField: "productCategory",
                    foreignField: "_id",
                    as: "productCategory",
                },
            },
            { $unwind: "$productCategory" },
        ];
        const orConditions = searchFields(userFields, query);
        if (orConditions.length > 0 && query.trim() !== "") {
            pipeline.push({ $match: { $or: orConditions } });
        }

        return productModel.aggregate(pipeline);
    };

    addProduct = (data: PostProductSchema & Images) =>
        errorHandler(() => productModel.create(data), "creating new product", {
            successStatus: 201,
        });

    getProductById = (id: string) =>
        errorHandler(() => productModel.findById(id), "getting product by id", {
            notFoundError: `Product with id #${id} not found`,
        });

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
