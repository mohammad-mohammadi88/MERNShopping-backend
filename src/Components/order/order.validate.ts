import { z } from "zod";

import { couponCodeSchema, userSchema } from "@/shared/schema.js";
import { productColorSchema } from "@Product/product.validate.js";
import { userAddressSchema } from "@User/user.validate.js";
import productsStatus from "../product/product.status.js";
import productStore from "../product/product.store.js";
import ordersStatus from "./order.status.js";

// orderProductCheck
const orderProductCheck = async (values: OrderProductSchema): Promise<true> => {
    const { product: productId, color } = values;
    const count = values.count || 1;

    const errors = {
        count: new Error("count field should be integer and positive"),
        status: new Error(`Product with id #${productId} in not published`),
        color: new Error(
            `This color is not available for product with id #${productId}`
        ),
        quantity: new Error(`We don't have that much of product ${productId}`),
    };
    type ErrorKeys = keyof typeof errors;

    if (!Number.isInteger(count) || count <= 0) throw errors.count;

    const { data, error } = await productStore.getProductById(productId);
    if (error) throw new Error(error);

    const product = data!;

    type ValidateKeys = Exclude<ErrorKeys, "count">;

    const validate: Record<ValidateKeys, boolean> = {
        status: product.status !== productsStatus.PUBLISHED,
        color:
            !color ||
            !product.colors.some(
                (productColor) =>
                    color.color === productColor.color &&
                    color.priceEffect === productColor.priceEffect &&
                    color.title === productColor.title
            ),
        quantity: product.quantity < count,
    };
    Object.keys(validate).forEach((schema) => {
        if (validate[schema as ValidateKeys]) throw errors[schema as ErrorKeys];
    });

    return true;
};

// order product
export const orderProductSchema = z
    .object({
        color: productColorSchema(z.number().nonnegative()).optional(),
        product: z.string().length(24),
        count: z.number().optional(),
    })
    .refine(orderProductCheck);
export type OrderProductSchema = z.infer<typeof orderProductSchema>;

// post order
export const postOrderSchema = z.object({
    products: z.array(orderProductSchema),
    couponCode: couponCodeSchema,
    user: userSchema,
    deliveryAddress: userAddressSchema.optional(),
});
export type PostOrderSchema = z.infer<typeof postOrderSchema>;

// edit oders status
const invalidStatusError = {
    error: `Order status can only be one of ${Object.values(ordersStatus).join(
        ", "
    )} values`,
    path: ["status"],
};
const statusValidator = (status: number): boolean =>
    (Object.values(ordersStatus) as number[]).includes(status);
export const editOrderStatusSchema = z.object({
    status: z.number().refine(statusValidator, invalidStatusError),
});
export type EditOrderStatusSchema = z.infer<typeof editOrderStatusSchema>;
