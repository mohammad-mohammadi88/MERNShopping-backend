import type { RequestHandler } from "express";

import { validate, validateAsync } from "@/middlewares/index.js";
import CouponValidator from "@/services/coupon/CouponValidator/CouponValidator.js";
import {
    paginationHandler,
    type GetDataWithPagination,
    type Pagination,
    type Status,
} from "@/shared/index.js";
import couponStore from "@Coupon/coupon.store.js";
import productStore from "@Product/product.store.js";
import userStore from "@User/user.store.js";
import ordersStatus from "./order.status.js";
import ordersStore from "./order.store.js";
import {
    editOrderStatusSchema,
    postOrderSchema,
    type EditOrderStatusSchema,
    type PostOrderSchema,
} from "./order.validate.js";
import type IOrder from "./schema/order.d.js";

const calcPercent = (price: number, percent: number): number =>
    price * (percent / 100);

// post new order
const postNewOrderCTRL: RequestHandler<
    null,
    string | IOrder,
    PostOrderSchema
> = async (req, res) => {
    const { products, couponCode } = req.body;

    // decrease product quantity count
    const productsPromise = products.map(async ({ product, count }) => {
        const { status: productStatus, error: productError } =
            await productStore.changeProductQuantity(
                product,
                (count || 1) * -1
            );
        if (productError) throw res.status(productStatus).send(productError);
    });
    await Promise.all(productsPromise);

    // increase user totalOrders
    const { status: userStatus, error: userError } =
        await userStore.changeTotalOrdersCount(req.body.user);
    if (userError) return res.status(userStatus).send(userError);

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

        try {
            const validator = new CouponValidator();
            await validator.handler(req.body.user, coupon);
        } catch (e: unknown) {
            const error = (e as Error).message;
            return res.status(400).send(error);
        }

        // change coupon used times
        const { status: cStatus, error: cError } =
            await couponStore.changeCouponUsedTimes(couponCode);
        if (cError) return res.status(cStatus).send(cError);

        const { amount, role } = coupon.discount;
        const discountPrice =
            role === "number" ? amount : calcPercent(finalPrice, amount);

        finalPrice =
            Math.round(Math.max(finalPrice - discountPrice, 0) * 100) / 100;
    }
    const newOrder = {
        ...req.body,
        totalPrice,
        finalPrice,
    };

    const { status, data, error } = await ordersStore.postOrder(newOrder);

    return res.status(status).send(data || error);
};
export const postNewOrderHandler: any[] = [
    validateAsync(postOrderSchema),
    postNewOrderCTRL,
];

// get all orders
export const getAllOrdersHandler: RequestHandler<
    null,
    string | GetDataWithPagination<IOrder>,
    null,
    Status & Pagination
> = async (req, res) => {
    const reqStatus = req.query.status;

    const pagination = paginationHandler(req);
    const { status, data, error } = await ordersStore.getAllOrders({
        status: reqStatus ? Number(reqStatus) : undefined,
        pagination,
    });
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

    if (status === ordersStatus.CANCELED) {
        // decrease coupon used times if couponCode exists
        if (prevOrder.couponCode) {
            const { status: couponStatus, error: couponError } =
                await couponStore.changeCouponUsedTimes(
                    prevOrder.couponCode,
                    "decreas"
                );
            if (couponError) return res.status(couponStatus).send(couponError);
        }
        // increase product quantity if order canceled
        const productsPromise = prevOrder.products.map(
            async ({ product, count }) => {
                const { status: productStatus, error: productError } =
                    await productStore.changeProductQuantity(product, count);
                if (productError)
                    throw res.status(productStatus).send(productError);
            }
        );
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
