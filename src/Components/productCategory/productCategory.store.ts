import {
    type Action,
    errorHandler,
    paginateData,
    type Pagination,
    searchFields,
} from "@/shared/index.js";
import productCategoryModel from "./productCategory.model.js";
import type { PostCategorySchema } from "./productCategory.validate.js";
import type IProductCategory from "./schema/productCategory.d.js";

class ProductCategoryStore {
    addCategory = (body: PostCategorySchema) =>
        errorHandler(
            () => productCategoryModel.create(body),
            "creating new category",
            { successStatus: 201 }
        );

    private getDataFn = (query: string) => () =>
        productCategoryModel.find({
            $or: searchFields(
                ["title", "attrGroups.title", "attrGroups.attrs"],
                query
            ),
        });

    getCategories = (query: string, pagination?: Required<Pagination>) =>
        paginateData<IProductCategory>(
            this.getDataFn(query),
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
