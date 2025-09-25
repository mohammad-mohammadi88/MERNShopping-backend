import { Schema } from "mongoose";

import { reference, statusSchema } from "@/shared/index.js";
import userAddressSchema from "@User/schema/user.address.js";
import UserModel from "@User/user.model.js";
import ordersStatus from "../order.status.js";
import type IOrder from "./order.d.js";
import orderProductSchema from "./order.product.js";

const orderSchema: Schema<IOrder> = new Schema(
    {
        finalPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        couponCode: { type: String, required: false },
        userId: reference("User"),
        products: {
            type: [orderProductSchema],
            required: true,
            validate: {
                validator: (v: unknown[]) => Array.isArray(v) && v.length > 0,
                message: "Order must have at least one product",
            },
        },
        status: statusSchema(ordersStatus),
        deliveryAddress: { type: userAddressSchema },
    },
    { timestamps: true }
);
orderSchema.pre("validate", async function (next) {
    if (!this.deliveryAddress) {
        const user = await UserModel.findById(this.userId).lean();
        this.deliveryAddress =
            user && user.addresses.length > 0 ? user.addresses[0] : null;
    }
    next();
});
export default orderSchema;
