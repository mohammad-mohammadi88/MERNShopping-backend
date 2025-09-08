import type { Document } from "mongoose";

export default interface IUserAddress extends Document {
    title: string;
    state: string;
    city: string;
    mobile: string;
    address: string;
    zipCode?: string;
    fullName: string;
}
