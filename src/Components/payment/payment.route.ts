import express from "express";

import {
    createSessionHandler,
    getAllPaymentsHandler,
    getSinglePaymentHandler,
} from "./payment.controller.js";

const router = express.Router();

router.post("/", createSessionHandler);
router.get("/", getAllPaymentsHandler);
router.get("/:id", getSinglePaymentHandler);

export default router;
