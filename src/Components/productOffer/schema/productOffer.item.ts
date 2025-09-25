import { Schema } from "mongoose";

import reference from "@/shared/reference.js";
import type IProductOfferItem from "./productOffer.item.d.js";

const productOfferItemSchema: Schema<IProductOfferItem> = new Schema({
    product: reference("Product"),
    price: { type: Number, required: true },
    image: { type: String, require: require },
});

export default productOfferItemSchema;
