import express from "express";

import {
    getCategoriesHandler,
    getCategoryByIdHandler,
    postCategoryHandler,
} from "./productCategory.controller.js";

const router = express.Router();

router.post("/", postCategoryHandler);
router.get("/", getCategoriesHandler);
router.get("/:id", getCategoryByIdHandler);

export default router;
