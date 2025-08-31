import { Schema } from "mongoose";

import type ProductOfferType from "../schema/productOffer.d.js";
import refrence from "@/contracts/refrence.js";

const productOfferSchema: Schema<ProductOfferType> = new Schema(
    {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        products: [refrence("Product")],
    },
    { timestamps: true }
);

export default productOfferSchema;
