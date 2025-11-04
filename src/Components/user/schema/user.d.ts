import type { Document } from "mongoose";

import type UserAddressType from "./user.address.d.js";

export default interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isAdmin: boolean;
    totalOrders: number;
    createdAt: Date;
    updatedAt: Date;
    addresses: UserAddressType[];
    mobile: string;
}
