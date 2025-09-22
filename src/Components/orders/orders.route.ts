import express from "express";

import {
    editOrderStatusHandler,
    getAllOrdersHandler,
    getOrderByIdHandler,
    postNewOrderHandler,
} from "./orders.controller.js";

const router = express.Router();

router.post("/", postNewOrderHandler);
router.get("/", getAllOrdersHandler);
router.get("/:id", getOrderByIdHandler);
router.patch("/:id", editOrderStatusHandler);

export default router;
