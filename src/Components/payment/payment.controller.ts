import { paymentStripe } from "@/services/index.js";
import type { RequestHandler } from "express";
import type { IOrderProduct } from "../order/index.js";
import type { PostOrderSchema } from "../order/order.validate.js";
import { productStore, type IProduct } from "../product/index.js";

export const createSession: RequestHandler<
    null,
    string | any,
    PostOrderSchema
> = async (req, res) => {
    const { products: productsSampleInfo } = req.body;

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
    const calcPrice = (product: FullInfoProducts) =>
        product.product.salePrice + (product?.color?.priceEffect || 0);

    const result = await paymentStripe.createPaymentSession(
        orderedProducts.map(({ count, product }) => ({
            quantity: count,
            amount: calcPrice({ count, product }),
            image: product.thumbnail,
            title: product.title,
        }))
    );
    console.log("🚀 ~ createSession ~ result:", result);
    return res.json({ url: result.url });
};
