import express from "express";

import { auth, authAdmin, userIdAccess } from "@Middlewares";
import {
    addShipmentHandler,
    editShimpentStatusHandler,
    getAllShipmentsHandler,
    getSingleShipmentHandler,
} from "./shipment.controller.js";

const router = express.Router();

router.use(auth);
router.post("/", addShipmentHandler);
router.get("/", authAdmin, getAllShipmentsHandler as any);

router.use("/:id", userIdAccess());
router.get("/:id", getSingleShipmentHandler);
router.patch("/:id", editShimpentStatusHandler);

export default router;
