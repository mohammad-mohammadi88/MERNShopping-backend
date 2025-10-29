import express from "express";

import { authAdmin } from "@Middlewares";
import {
    createSessionHandler,
    getAllPaymentsHandler,
    getSinglePaymentHandler,
} from "./payment.controller.js";

const router = express.Router();

router.post("/", createSessionHandler);
router.get("/:id", getSinglePaymentHandler);

router.use(authAdmin);
router.get("/", getAllPaymentsHandler);

export default router;
