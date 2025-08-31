import { model } from "mongoose";
import productOfferSchema from "../schema/productOffer.js";

const UserModel = model("ProductOffer", productOfferSchema);
export default UserModel;
