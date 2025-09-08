import errorHandler from "@/shared/errorHandler.js";
import ProductCategoryModel from "./model/products.category.model.js";
import type { PostSchema } from "./productCategory.validate.js";

class ProductCategoryStore {
    addCategory = (body: PostSchema) =>
        errorHandler(
            () => new ProductCategoryModel(body).save(),
            "creating new category"
        );

    getCategories = () =>
        errorHandler(() => ProductCategoryModel.find(), "getting categories");
}

const productCategoryStore = new ProductCategoryStore();

export default productCategoryStore;
