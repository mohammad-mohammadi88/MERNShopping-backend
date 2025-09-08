import { Schema } from "mongoose";

import userAddressSchema from "@Users/schema/users.address.js";
import UserModel from "@Users/model/users.model.js";
import ordersStatus from "../orders.status.js";
import refrence from "@/shared/refrence.js";
import type OrderType from "./orders.d.js";

const statusType = {
    type: Number,
    required: true,
    enum: Object.values(ordersStatus),
    default: ordersStatus.PENDING,
};
const orderSchema: Schema<OrderType> = new Schema(
    {
        finalPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        coupon: refrence("Coupon"),
        userId: refrence("User"),
        status: statusType,
        deliveryAddress: { type: userAddressSchema },
    },
    { timestamps: true }
);
orderSchema.pre("validate", async function (next) {
    if (!this.deliveryAddress) {
        const user = await UserModel.findById(this.userId).lean();
        // @ts-ignore
        this.addresses =
            user && user.addresses.length > 0 ? user.addresses[0] : null;
    }
    next();
});
export default orderSchema;
