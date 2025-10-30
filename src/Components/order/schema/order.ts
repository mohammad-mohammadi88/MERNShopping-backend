import { Schema } from "mongoose";

import { reference, statusSchema } from "@Shared";
import { userAddressSchema, userModel } from "@User/index.js";
import ordersStatus from "../order.status.js";
import { type IOrder } from "./index.js";
import orderProductSchema from "./order.product.js";

const orderSchema: Schema<IOrder> = new Schema(
    {
        finalPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        couponCode: { type: String, required: false },
        user: reference("User"),
        payment: reference("Payment", false),
        shipment: reference("Shipment", false),
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
).pre("validate", async function () {
    if (!this.deliveryAddress) {
        const user = await userModel.findById(this.user);
        this.deliveryAddress =
            user && user.addresses.length > 0 ? user.addresses[0] : null;
    }
});

export default orderSchema;
