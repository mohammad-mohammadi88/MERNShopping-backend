import type { Document } from "mongoose";

import type ProductOfferItemType from "./productOffer.item";

export default interface ProductOfferType extends Document {
    startDate: Date;
    products: ProductOfferItemType[];
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
