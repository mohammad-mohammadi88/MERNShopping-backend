import type { Document } from "mongoose";

export default interface IProductOffer extends Document {
    startDate: Date;
    products: IProductOfferItem[];
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
