import express from "express";

import {
    getAllCouponsHandler,
    getCouponWithIdHandler,
    postCouponHandler,
} from "./coupon.controller.js";

const router = express.Router();

router.get("/", getAllCouponsHandler);
router.post("/", postCouponHandler);
router.get("/:id", getCouponWithIdHandler);

export default router;
