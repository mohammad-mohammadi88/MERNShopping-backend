import { Schema } from "mongoose";
import type UserType from "./users.d.js";

const userSchema: Schema<UserType> = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        mobile: { type: String, required: true, unique: true },
        totalOrders: { type: Number, default: 0 },
        wallet: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default userSchema;
