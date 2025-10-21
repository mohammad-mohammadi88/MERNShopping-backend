import express from "express";

import {
    createSessionHandler,
    getAllPaymentsHandler,
} from "./payment.controller.js";

const router = express.Router();

router.post("/", createSessionHandler);
router.get("/", getAllPaymentsHandler);

export default router;
