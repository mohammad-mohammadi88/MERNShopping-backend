import express from "express";

import { authAdmin } from "@Middlewares";
import {
    getCategoriesHandler,
    getCategoryByIdHandler,
    postCategoryHandler,
} from "./productCategory.controller.js";

const router = express.Router();

router.get("/", getCategoriesHandler);
router.get("/:id", getCategoryByIdHandler);

router.use(authAdmin);
router.post("/", postCategoryHandler);

export default router;
