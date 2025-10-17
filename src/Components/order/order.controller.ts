import type { Request, RequestHandler, Response } from "express";

import { validate, validateAsync } from "@/middlewares/index.js";
import { CouponValidator } from "@/services/index.js";
import {
    paginationHandler,
    type GetDataWithPagination,
    type IQuery,
    type Pagination,
    type Status,
} from "@/shared/index.js";
import couponStore from "@Coupon/coupon.store.js";
import productStore from "@Product/product.store.js";
import type IProduct from "@Product/schema/product.d.js";
import userStore from "@User/user.store.js";
import {
    editOrderStatusSchema,
    ordersStatus,
    ordersStore,
    postOrderSchema,
    StatusValidator,
    type EditOrderStatusSchema,
    type FullOrder,
    type IOrder,
    type IOrderProduct,
    type PostOrderSchema,
} from "./index.js";

const calcPercent = (price: number, percent: number): number =>
    price * (percent / 100);

// post new order
const handleCounpon = async (
    priceUntilNow: number,
    req: Request<null, string | IOrder, PostOrderSchema>,
    res: Response
) => {
    const { couponCode, user } = req.body;
    const {
        status: couponStatus,
        data: coupon,
        error: couponError,
    } = await couponStore.getCoupon(couponCode!);
    if (couponError) throw res.status(couponStatus).send(couponError);
    // this code will never return
    if (!coupon) return 0;

    try {
        const validator = new CouponValidator();
        await validator.handler(user, coupon);
    } catch (e: unknown) {
        const error = (e as Error).message;
        throw res.status(400).send(error);
    }

    // change coupon used times
    const { status: cStatus, error: cError } =
        await couponStore.changeCouponUsedTimes(couponCode!);
    if (cError) throw res.status(cStatus).send(cError);

    const { amount, role } = coupon.discount;
    const discountPrice =
        role === "number" ? amount : calcPercent(priceUntilNow, amount);

    return Math.round(Math.max(priceUntilNow - discountPrice, 0) * 100) / 100;
};
const postNewOrderCTRL: RequestHandler<
    null,
    string | IOrder,
    PostOrderSchema
> = async (req, res) => {
    const { products: productsSampleInfo, couponCode } = req.body;

    // decrease product quantity count
    const productsPromise = productsSampleInfo.map(
        async ({ product, count }) => {
            const { status: productStatus, error: productError } =
                await productStore.changeProductQuantity(
                    product,
                    (count || 1) * -1
                );
            if (productError)
                throw res.status(productStatus).send(productError);
        }
    );
    await Promise.all(productsPromise);

    // increase user totalOrders
    const { status: userStatus, error: userError } =
        await userStore.changeTotalOrdersCount(req.body.user);
    if (userError) return res.status(userStatus).send(userError);

    interface FullInfoProducts extends Pick<IOrderProduct, "count" | "color"> {
        product: IProduct;
    }
    const getProductsWithIds = productsSampleInfo.map(
        async ({
            product: productId,
            color,
            count,
        }): Promise<FullInfoProducts> => {
            const {
                status,
                data: product,
                error,
            } = await productStore.getProductById(productId);
            if (error) throw res.status(status).send(error);
            return {
                product: product as unknown as IProduct,
                count: count || 1,
                color,
            };
        }
    );
    const orderedProducts = await Promise.all(getProductsWithIds);

    const calcPrice = (param: "price" | "salePrice" = "price") =>
        orderedProducts.reduce(
            (prev, current) =>
                (current.product[param] + (current?.color?.priceEffect || 0)) *
                    (current?.count || 1) +
                prev,
            0
        );
    const totalPrice = calcPrice();
    let finalPrice = calcPrice("salePrice");
    if (couponCode) {
        try {
            finalPrice = await handleCounpon(finalPrice, req, res);
        } catch (e) {
            return e;
        }
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
    Status & Pagination & IQuery
> = async (req, res) => {
    const reqStatus = req.query.status;
    const query = req.query.query || "";

    const pagination = paginationHandler(req);
    const { status, data, error } = await ordersStore.getAllOrders({
        status: reqStatus ? Number(reqStatus) : undefined,
        query,
        pagination,
    });
    return res.status(status).send(data || error);
};

// get order by id
export const getOrderByIdHandler: RequestHandler<
    { id: string },
    string | FullOrder
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

    try {
        const validator = new StatusValidator();
        validator.handler(status as any, prevOrder.status);
    } catch (e) {
        const error = (e as Error).message;
        return res.status(400).send(error);
    }

    if (status === ordersStatus.CANCELED) {
        // decrease coupon used times if couponCode exists
        if (prevOrder.couponCode) {
            const { status: couponStatus, error: couponError } =
                await couponStore.changeCouponUsedTimes(
                    prevOrder.couponCode.code,
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
