import express from "express";

import {
    deleteProductByIdHandler,
    editProductByIdHandler,
    getAllProductsHandler,
    getProductByIdHandler,
    postProductHandler,
} from "./products.controller.js";

const router = express.Router();

router.post("/", postProductHandler);
router.get("/", getAllProductsHandler);
router.get("/:id", getProductByIdHandler);
router.put("/:id", editProductByIdHandler);
router.delete("/:id", deleteProductByIdHandler);

export default router;
