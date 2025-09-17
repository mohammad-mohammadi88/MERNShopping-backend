import errorHandler from "@/shared/errorHandler.js";
import ProductCategoryModel from "./model/products.category.model.js";
import type { PostCategorySchema } from "./productCategory.validate.js";

type ChangeProductCountAction = "increase" | "decrease";
class ProductCategoryStore {
    addCategory = (body: PostCategorySchema) =>
        errorHandler(
            () => new ProductCategoryModel(body).save(),
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

    changeProductCount = (
        _id: string,
        action: ChangeProductCountAction = "increase"
    ) =>
        errorHandler(
            () =>
                ProductCategoryModel.findOneAndUpdate(
                    {
                        _id,
                        totalProducts: { $gt: action === "increase" ? -1 : 0 },
                    },
                    {
                        $inc: {
                            totalProducts: action === "increase" ? 1 : -1,
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

const productCategoryStore = new ProductCategoryStore();

export default productCategoryStore;
