import express from "express";

import {
    getAllCouponsHandler,
    getCouponWithCodeHandler,
    postCouponHandler,
} from "./coupon.controller.js";

const router = express.Router();

router.get("/", getAllCouponsHandler);
router.post("/", postCouponHandler);
router.get("/:code", getCouponWithCodeHandler);

export default router;
