import errorHandler from "@/shared/errorHandler.js";
import ProductCategoryModel from "./model/products.category.model.js";
import type { PostCategorySchema } from "./productCategory.validate.js";

class ProductCategoryStore {
    addCategory = (body: PostCategorySchema) =>
        errorHandler(
            () => new ProductCategoryModel(body).save(),
            "creating new category"
        );

    getCategories = () =>
        errorHandler(() => ProductCategoryModel.find(), "getting categories");

    getCategoryById = (id: string) =>
        errorHandler(
            () => ProductCategoryModel.findById(id),
            "getting category by id"
        );
}

const productCategoryStore = new ProductCategoryStore();

export default productCategoryStore;
