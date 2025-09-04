import { Schema } from "mongoose";

import type IProductOfferItem from "./productOffer.item.d.js";
import refrence from "@/shared/refrence.js";

const productOfferItemSchema: Schema<IProductOfferItem> = new Schema({
    product: refrence("Product"),
    price: { type: Number, required: true },
    image: { type: String, require: require },
});

export default productOfferItemSchema;
