import { model } from "mongoose";
import couponSchema from "../schema/coupon.js";

const CouponModel = model("Coupon", couponSchema);
export default CouponModel;
