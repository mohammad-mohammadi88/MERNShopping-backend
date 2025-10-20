import express from "express";

import { createSessionHandler } from "./payment.controller.js";

const router = express.Router();

router.post("/", createSessionHandler);

export default router;
