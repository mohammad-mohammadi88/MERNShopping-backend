import express from "express";

import { authAdmin } from "@Middlewares";
import {
    editOrderStatusHandler,
    getAllOrdersHandler,
    getOrderByIdHandler,
    getOrdersCountHandler,
    postNewOrderHandler,
} from "./order.controller.js";

const router = express.Router();

router.post("/", postNewOrderHandler);

router.get("/count", authAdmin, getOrdersCountHandler as any);

router.get("/:id", getOrderByIdHandler);

router.use(authAdmin);
router.get("/", getAllOrdersHandler);
router.patch("/:id", editOrderStatusHandler);

export default router;
