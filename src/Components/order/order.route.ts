import express from "express";

import { auth, authAdmin } from "@Middlewares";
import {
    editOrderStatusHandler,
    getAllOrdersHandler,
    getOrderByIdHandler,
    getOrdersCountHandler,
    postNewOrderHandler,
} from "./order.controller.js";

const router = express.Router();

router.use(auth);
router.post("/", postNewOrderHandler);
router.get("/:id", getOrderByIdHandler);

router.use(authAdmin);
router.get("/count", getOrdersCountHandler);
router.get("/", getAllOrdersHandler);
router.patch("/:id", editOrderStatusHandler);

export default router;
