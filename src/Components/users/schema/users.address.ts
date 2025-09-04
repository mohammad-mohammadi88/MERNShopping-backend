import { Schema } from "mongoose";
import type IUser from "./users.address.d.js";

const userAddressSchema: Schema<IUser> = new Schema({
    fullName: { type: String, required: true },
    title: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    mobile: { type: String, required: true },
    zipCode: { type: String },
});

export default userAddressSchema;
