import type { Document, Types } from "mongoose";

export default interface ProductOfferItemType extends Document {
    image: string;
    product: Types.ObjectId;
    price: number;
    createdAt: Date;
    updatedAt: Date;
}
