import express from "express";

import { authAdmin } from "@Middlewares";
import {
    deleteProductByIdHandler,
    editProductByIdHandler,
    getAllProductsHandler,
    getProductByIdHandler,
    postProductHandler,
} from "./product.controller.js";

const router = express.Router();

router.get("/", getAllProductsHandler);
router.get("/:id", getProductByIdHandler);

router.use(authAdmin);
router.post("/", postProductHandler);
router.put("/:id", editProductByIdHandler);
router.delete("/:id", deleteProductByIdHandler);

export default router;
