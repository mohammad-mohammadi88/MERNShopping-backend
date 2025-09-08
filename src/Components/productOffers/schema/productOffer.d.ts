import type { Document } from "mongoose";

import type IProductOfferItem from "./productOffer.item";

export default interface IProductOffer extends Document {
    startDate: Date;
    products: IProductOfferItem[];
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
