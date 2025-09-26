import { z } from "zod";

import { couponCodeSchema, userSchema } from "@/shared/schema.js";
import { productColorSchema } from "@Product/product.validate.js";
import { userAddressSchema } from "@User/user.validate.js";
import ordersStatus from "./order.status.js";

// order product
export const orderProductSchema = z.object({
    color: productColorSchema(z.number().nonnegative()).optional(),
    product: z.string().length(24),
    count: z.number().optional(),
    productPrice: z.number().nonnegative(),
    productSalePrice: z.number().nonnegative(),
});
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
