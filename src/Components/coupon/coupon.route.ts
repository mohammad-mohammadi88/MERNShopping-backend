import express from "express";

import {
    editCouponStatusHandler,
    getAllCouponsHandler,
    getCouponWithCodeHandler,
    postCouponHandler,
} from "./coupon.controller.js";

const router = express.Router();

router.get("/", getAllCouponsHandler);
router.post("/", postCouponHandler);
router.get("/:code", getCouponWithCodeHandler);
router.patch("/:code", editCouponStatusHandler);

export default router;
