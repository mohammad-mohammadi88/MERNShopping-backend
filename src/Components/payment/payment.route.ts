import express from "express";

import validateAsync from "@/middlewares/validateAsync.js";
import { postOrderSchema } from "../order/order.validate.js";
import { createSession } from "./payment.controller.js";

const router = express.Router();

router.post("/", validateAsync(postOrderSchema), createSession as any);
export default router;
