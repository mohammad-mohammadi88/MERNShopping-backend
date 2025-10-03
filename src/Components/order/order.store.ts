import {
    type GetDataFns,
    type PaginationWithStatus,
    errorHandler,
    paginateData,
} from "@/shared/index.js";
import { default as OrderModel, default as orderModel } from "./order.model.js";
import type { PostOrderSchema } from "./order.validate.js";
import type IOrder from "./schema/order.d.js";

type PostOrderData = PostOrderSchema & {
    totalPrice: number;
    finalPrice: number;
};
const getterFns: (status?: number) => GetDataFns<IOrder> = (status) => ({
    getDataFn: () =>
        orderModel
            .find(typeof status === "number" ? { status } : {})
            .populate(["user", "products.product"]),
    getCountFn: () => orderModel.countDocuments(),
});
class OrderStore {
    postOrder = (data: PostOrderData) =>
        errorHandler(() => OrderModel.create(data), "creating new order", {
            successStatus: 201,
        });

    getOrdersCount = () =>
        errorHandler(() => OrderModel.countDocuments(), "getting orders count");

    getAllOrders = ({ status, pagination }: PaginationWithStatus) =>
        paginateData<IOrder>(getterFns(status), "order", pagination);

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
