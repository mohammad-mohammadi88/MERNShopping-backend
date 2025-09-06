import { model } from "mongoose";

import productOfferSchema from "../schema/productOffer.js";

const ProductOfferModel = model("ProductOffer", productOfferSchema);
export default ProductOfferModel;
