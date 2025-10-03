import {
    type Action,
    errorHandler,
    type GetDataFns,
    paginateData,
    type Pagination,
} from "@/shared/index.js";
import productCategoryModel from "./productCategory.model.js";
import type { PostCategorySchema } from "./productCategory.validate.js";
import type IProductCategory from "./schema/productCategory.d.js";

const getterFns: GetDataFns<IProductCategory> = {
    getCountFn: () => productCategoryModel.countDocuments(),
    getDataFn: () => productCategoryModel.find(),
};
class ProductCategoryStore {
    addCategory = (body: PostCategorySchema) =>
        errorHandler(
            () => productCategoryModel.create(body),
            "creating new category",
            { successStatus: 201 }
        );

    getCategories = (pagination?: Required<Pagination>) =>
        paginateData<IProductCategory>(
            getterFns,
            "product category",
            pagination
        );

    getCategoryById = (id: string) =>
        errorHandler(
            () => productCategoryModel.findById(id),
            "getting category by id",
            { notFoundError: `Category with id #${id} not found` }
        );

    changeProductCount = (_id: string, action: Action = "increas") =>
        errorHandler(
            () =>
                productCategoryModel.findOneAndUpdate(
                    {
                        _id,
                        totalProducts: { $gt: action === "increas" ? -1 : 0 },
                    },
                    {
                        $inc: {
                            totalProducts: action === "increas" ? 1 : -1,
                        },
                    },
                    { new: true }
                ),
            `${action}ing product count`,
            {
                notFoundError: `Category with id #${_id} doesn't exists`,
            }
        );
}

export default new ProductCategoryStore();
