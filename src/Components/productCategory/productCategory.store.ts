import { type Action, errorHandler } from "@/shared/index.js";
import ProductCategoryModel from "./productCategory.model.js";
import type { PostCategorySchema } from "./productCategory.validate.js";

class ProductCategoryStore {
    addCategory = (body: PostCategorySchema) =>
        errorHandler(
            () => ProductCategoryModel.create(body),
            "creating new category",
            { successStatus: 201 }
        );

    getCategories = () =>
        errorHandler(() => ProductCategoryModel.find(), "getting categories");

    getCategoryById = (id: string) =>
        errorHandler(
            () => ProductCategoryModel.findById(id),
            "getting category by id",
            { notFoundError: `Category with id #${id} not found` }
        );

    changeProductCount = (_id: string, action: Action = "increas") =>
        errorHandler(
            () =>
                ProductCategoryModel.findOneAndUpdate(
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
