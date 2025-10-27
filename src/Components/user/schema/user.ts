import { Schema } from "mongoose";

import userAddressSchema from "./user.address.js";
import type IUser from "./user.d.js";

const userSchema: Schema<IUser> = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        mobile: { type: String, required: true, unique: true },
        addresses: { type: [userAddressSchema], default: [] },
        totalOrders: { type: Number, default: 0 },
        password: { type: String, require: true, select: false },
        isAdmin: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default userSchema;
