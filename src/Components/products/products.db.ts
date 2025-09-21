import type { Images } from "@/services/cloudinary/request.js";
import errorHandler from "@/shared/errorHandler.js";
import ProductModel from "./model/products.model.js";
import type {
    EditProductSchema,
    PostProductSchema,
} from "./products.validate.js";
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
        errorHandler(() => ProductModel.create(data), "creating new product", {
            successStatus: 201,
        });

    getProductById = (id: string) =>
        errorHandler(() => ProductModel.findById(id), "getting product by id", {
            notFoundError: `Product with id #${id} not found`,
        });

    orderProduct = (_id: string) =>
        errorHandler(
            () =>
                ProductModel.findOneAndUpdate(
                    {
                        _id,
                        quantity: { $gt: 0 },
                    },
                    { $inc: { quantity: -1 } },
                    { new: true }
                ),

            `ordering product with id #${_id}`,
            {
                notFoundError: "You are not able to order this product",
            }
        );

    storeProduct = (id: string) =>
        errorHandler(
            async () =>
                await ProductModel.findByIdAndUpdate(
                    id,
                    { $inc: { quantity: 1 } },
                    { new: true }
                ),
            `storing product with id #${id}`,
            {
                notFoundError: `Product with id #${id} not found`,
            }
        );

    getProducts = (pagination?: Required<Pagination>) =>
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

const productStore = new ProductStore();
export default productStore;
