import {
    type GetDataWithPagination,
    type Pagination,
    errorHandler,
} from "@/shared/index.js";
import { default as OrderModel, default as orderModel } from "./order.model.js";
import type { PostOrderSchema } from "./order.validate.js";
import type IOrder from "./schema/order.d.js";

type PostOrderData = PostOrderSchema & {
    totalPrice: number;
    finalPrice: number;
};
class OrderStore {
    postOrder = (data: PostOrderData) =>
        errorHandler(() => OrderModel.create(data), "creating new order", {
            successStatus: 201,
        });

    getOrdersCount = () =>
        errorHandler(() => OrderModel.countDocuments(), "getting orders count");

    getAllOrders = ({
        status,
        pagination,
    }: {
        status?: number;
        pagination?: Required<Pagination>;
    }) =>
        errorHandler(async (): Promise<GetDataWithPagination<IOrder>> => {
            const result = orderModel
                .find(typeof status === "number" ? { status } : {})
                .populate(["user", "products.product"]);
            const totalDocs = await orderModel.countDocuments();
            if (!pagination)
                return {
                    currentPage: 1,
                    perPage: totalDocs,
                    pages: 1,
                    data: await result,
                };

            const { page, perPage } = pagination;
            const pages = Math.ceil(totalDocs / perPage);
            const currentPage = pages === 0 ? 1 : Math.min(page, pages);
            const skip = (currentPage - 1) * perPage;
            const data = await result.skip(skip).limit(perPage);

            return { pages, perPage, currentPage, data };
        }, "getting orders");

    getOrder = (id: string) =>
        errorHandler(() => OrderModel.findById(id), "getting one order", {
            notFoundError: `Order with id #${id} doesn't exists`,
        });

    editOrderStatus = (id: string, status: number) =>
        errorHandler(
            () => OrderModel.findByIdAndUpdate(id, { status }),
            "editing order status",
            { notFoundError: `Order with id #${id} doesn't exists` }
        );
}

const orderStore = new OrderStore();
export default orderStore;
