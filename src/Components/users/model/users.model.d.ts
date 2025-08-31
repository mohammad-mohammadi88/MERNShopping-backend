import type { Document } from "mongoose";

export default interface UserType extends Document {
    firstName: string;
    lastName: string;
    email: string;
    totalOrders: number;
    createdAt: Date;
    wallet: number;
    mobile: string;
}
