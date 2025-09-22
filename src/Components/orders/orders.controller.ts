import validate from "@/middlewares/validate.js";
import type { RequestHandler } from "express";
import couponStore from "../coupon/coupon.db.js";
import productStore from "../products/products.db.js";
import ordersStore from "./orders.db.js";
import ordersStatus from "./orders.status.js";
import {
    editOrderStatusSchema,
    postOrderSchema,
    type EditOrderStatusSchema,
    type PostOrderSchema,
} from "./orders.validate.js";
import type IOrder from "./schema/orders.d.js";

const calcPercent = (price: number, percent: number): number =>
    price * (percent / 100);

// post new order
const postNewOrderCTRL: RequestHandler<
    null,
    string | IOrder,
    PostOrderSchema
> = async (req, res) => {
    const { products, couponCode } = req.body;
    const calcPrice = (
        param: "productPrice" | "productSalePrice" = "productPrice"
    ) =>
        products.reduce(
            (prev, current) =>
                (current[param] + (current?.color?.priceEffect || 0)) *
                    (current?.count || 1) +
                prev,
            0
        );
    const totalPrice = calcPrice();
    let finalPrice = calcPrice("productSalePrice");
    if (couponCode) {
        const {
            status: couponStatus,
            data: coupon,
            error: couponError,
        } = await couponStore.getCoupon(couponCode);
        if (couponError) return res.status(couponStatus).send(couponError);
        // this code will never return
        if (!coupon) return;

        const { amount, role } = coupon.discount;
        const discountPrice =
            role === "number" ? amount : calcPercent(finalPrice, amount);
        finalPrice -= discountPrice;
    }
    const newOrder = {
        ...req.body,
        totalPrice,
        finalPrice,
    };

    // decrease ordered products count
    const productsPromise = products.map(async ({ productID, count }) => {
        const { status: productStatus, error: productError } =
            await productStore.changeProductQuantity(
                productID,
                (count || 1) * -1
            );
        if (productError) throw res.status(productStatus).send(productError);
    });
    await Promise.all(productsPromise);

    const { status, data, error } = await ordersStore.postOrder(newOrder);

    return res.status(status).send(data || error);
};
export const postNewOrderHandler: any[] = [
    validate(postOrderSchema),
    postNewOrderCTRL,
];

// get all orders
export const getAllOrdersHandler: RequestHandler<
    null,
    string | IOrder[],
    null,
    { status: string }
> = async (req, res) => {
    const { status, data, error } = await ordersStore.getAllOrders(
        Number(req.query.status)
    );
    return res.status(status).send(data || error);
};

// get order by id
export const getOrderByIdHandler: RequestHandler<
    { id: string },
    string | IOrder
> = async (req, res) => {
    const { status, data, error } = await ordersStore.getOrder(req.params.id);
    return res.status(status).send(data || error);
};

// get orders count
export const getOrdersCountHandler: RequestHandler<
    null,
    string | number
> = async (_, res) => {
    const { status, data, error } = await ordersStore.getOrdersCount();
    return res.status(status).send(data || error);
};

// edit order status
const editOrderStatusCTRL: RequestHandler<
    { id: string },
    string | IOrder,
    EditOrderStatusSchema
> = async (req, res) => {
    const status = req.body.status;
    const id = req.params.id;

    const {
        status: orderStatus,
        data: prevOrder,
        error: orderError,
    } = await ordersStore.getOrder(id);
    if (orderError) return res.status(orderStatus).send(orderError);
    if (!prevOrder) return;

    if (prevOrder?.status >= status)
        return res
            .status(406)
            .send("You cannot change the status to previous status");

    if (
        prevOrder?.status === ordersStatus.RECEIVED ||
        prevOrder?.status === ordersStatus.CANCELED
    ) {
        const orderStatusError = `Received = ${ordersStatus.RECEIVED} and Cenceled = ${ordersStatus.CANCELED} order statuses are not editable`;
        return res.status(406).send(orderStatusError);
    }

    // increase product quantity if order canceled
    if (status === ordersStatus.CANCELED) {
        const productsPromise = prevOrder.products.map(async (product) => {
            const { status: productStatus, error: productError } =
                await productStore.changeProductQuantity(
                    product.productID,
                    product.count
                );
            if (productError)
                throw res.status(productStatus).send(productError);
        });
        await Promise.all(productsPromise);
    }

    const {
        status: statusCode,
        data,
        error,
    } = await ordersStore.editOrderStatus(id, status);

    if (data) data.status = status as any;
    return res.status(statusCode).send(data || error);
};
export const editOrderStatusHandler: any[] = [
    validate(editOrderStatusSchema),
    editOrderStatusCTRL,
];
