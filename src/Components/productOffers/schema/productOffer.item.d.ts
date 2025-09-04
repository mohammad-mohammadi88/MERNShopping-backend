import type { Document, Types } from "mongoose";

export default interface IProductOfferItem extends Document {
    image: string;
    product: Types.ObjectId;
    price: number;
}
