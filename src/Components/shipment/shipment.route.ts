import express from "express";

import { authAdmin, userIdAccess } from "@Middlewares";
import {
    addShipmentHandler,
    editShimpentStatusHandler,
    getAllShipmentsHandler,
    getSingleShipmentHandler,
} from "./shipment.controller.js";

const router = express.Router();

router.use("/:id", userIdAccess());
router.get("/:id", getSingleShipmentHandler);
router.post("/", addShipmentHandler);

router.use(authAdmin);
router.get("/", getAllShipmentsHandler);
router.patch("/:id", editShimpentStatusHandler);

export default router;
