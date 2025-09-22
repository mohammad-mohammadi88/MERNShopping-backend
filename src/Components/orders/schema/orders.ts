import { Schema } from "mongoose";

import refrence from "@/shared/refrence.js";
import UserModel from "@Users/model/users.model.js";
import userAddressSchema from "@Users/schema/users.address.js";
import ordersStatus from "../orders.status.js";
import orderProductSchema from "./order.product.js";
import type IOrder from "./orders.d.js";

const statusType = {
    type: Number,
    required: true,
    enum: Object.values(ordersStatus),
    default: ordersStatus.INIT,
};
const orderSchema: Schema<IOrder> = new Schema(
    {
        finalPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        couponCode: { type: String, required: false },
        userId: refrence("User"),
        products: {
            type: [orderProductSchema],
            required: true,
            validate: {
                validator: (v: unknown[]) => Array.isArray(v) && v.length > 0,
                message: "Order must have at least one product",
            },
        },
        status: statusType,
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
