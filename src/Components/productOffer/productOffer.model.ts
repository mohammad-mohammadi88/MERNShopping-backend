import { model } from "mongoose";

import collections from "@/shared/collections.js";
import type IProductOffer from "./schema/productOffer.d.js";
import productOfferSchema from "./schema/productOffer.js";

export default model<IProductOffer>(
    collections.productOffer,
    productOfferSchema
);
