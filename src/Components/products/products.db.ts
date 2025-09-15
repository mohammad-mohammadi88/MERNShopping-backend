import type { Images } from "@/services/cloudinary/request.js";
import errorHandler from "@/shared/errorHandler.js";
import ProductModel from "./model/products.model.js";
import type { PostProductSchema } from "./products.validate.js";
import type IProduct from "./schema/products.d.js";

export interface GetProducts {
    pages: number;
    products: IProduct[];
    perPage: number;
    currentPage: number;
}
export interface Pagination {
    perPage?: number;
    page?: number;
}
class ProductStore {
    addProduct = (data: PostProductSchema & Images) =>
        errorHandler(
            () => new ProductModel(data).save(),
            "creating new product"
        );

    getProductById = (id: string) =>
        errorHandler(() => ProductModel.findById(id), "getting product by id");

    getProducts = (
        pagination?: Required<Pagination>
    ): Promise<string | GetProducts> =>
        errorHandler(async (): Promise<GetProducts> => {
            const result = ProductModel.find();
            const totalDocs = await ProductModel.countDocuments();
            if (!pagination)
                return {
                    currentPage: 1,
                    perPage: totalDocs,
                    pages: 1,
                    products: (await result) as unknown as IProduct[],
                };

            const { page, perPage } = pagination;
            const pages = Math.ceil(totalDocs / perPage);
            const currentPage = pages === 0 ? 1 : Math.min(page, pages);
            const skip = (currentPage - 1) * perPage;
            const products = (await result
                .skip(skip)
                .limit(perPage)) as unknown as IProduct[];

            return { pages, perPage, currentPage, products };
        }, "getting products");
}

const productStore = new ProductStore();
export default productStore;
