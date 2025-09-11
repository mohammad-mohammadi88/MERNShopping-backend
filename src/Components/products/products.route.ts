import express from "express";

import {
    getAllProductsHandler,
    getProductByIdHandler,
    postProductHandler,
} from "./products.controller.js";

const router = express.Router();

router.post("/", postProductHandler);
router.get("/", getAllProductsHandler);
router.get("/:id", getProductByIdHandler);

export default router;
