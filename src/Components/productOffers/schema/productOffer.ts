import { Schema } from "mongoose";

import type IProductOffer from "./productOffer.d.js";
import productOfferItemSchema from "./productOffer.item.js";

const productOfferSchema: Schema<IProductOffer> = new Schema(
    {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        products: { type: [productOfferItemSchema], require: true },
    },
    { timestamps: true }
);

export default productOfferSchema;
