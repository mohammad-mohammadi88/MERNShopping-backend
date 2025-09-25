import { model } from "mongoose";

import type IProductOffer from "./schema/productOffer.d.js";
import productOfferSchema from "./schema/productOffer.js";

export default model<IProductOffer>("ProductOffer", productOfferSchema);
