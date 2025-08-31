import { model, Schema } from "mongoose";
import type UserType from "./users.model.d.js";

const userSchema: Schema = new Schema(
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

const UserModel = model<UserType>("User", userSchema);
export default UserModel;
