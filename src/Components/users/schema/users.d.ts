import type { Document } from "mongoose";
import type UserAddressType from "./users.address";

export default interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    totalOrders: number;
    createdAt: Date;
    updatedAt: Date;
    addresses: UserAddressType[];
    wallet: number;
    mobile: string;
}
