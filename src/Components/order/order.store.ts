import errorHandler from "@/shared/errorHandler.js";
import OrderModel from "./order.model.js";
import type { PostOrderSchema } from "./order.validate.js";

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

    getAllOrders = (status?: number) =>
        errorHandler(
            () =>
                OrderModel.find(status ? { status } : {}).populate([
                    "userId",
                    "products.productID",
                ]),
            "getting all orders"
        );

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
