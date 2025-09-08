import express from "express";
import { postCategoryHandler } from "./productCategory.controller.js";

const router = express.Router();

router.post("/", postCategoryHandler);

export default router;
