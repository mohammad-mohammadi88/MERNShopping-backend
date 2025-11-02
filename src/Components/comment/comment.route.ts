import express from "express";

import { authAdmin } from "@Middlewares";
import {
    addCommentHandler,
    getAllCommentHandler,
    getProductCommentsHandler,
    getSingleCommentHandler,
    updateCommentHandler,
} from "./comment.controller.js";

const router = express.Router();

router.post("/", addCommentHandler);
router.get("/product/:productId", getProductCommentsHandler);

router.use(authAdmin);
router.get("/:id", getSingleCommentHandler);
router.get("/", getAllCommentHandler);
router.patch("/:id", updateCommentHandler);

export default router;
