import express from "express";

import {
    editOrderStatusHandler,
    getAllOrdersHandler,
    getOrderByIdHandler,
    getOrdersCountHandler,
    postNewOrderHandler,
} from "./order.controller.js";

const router = express.Router();

router.post("/", postNewOrderHandler);
router.get("/", getAllOrdersHandler);
router.get("/count", getOrdersCountHandler);
router.get("/:id", getOrderByIdHandler);
router.patch("/:id", editOrderStatusHandler);

export default router;
