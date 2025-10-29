import express from "express";

import { authAdmin } from "@Middlewares";
import {
    addCommentHandler,
    getAllCommentHandler,
    getProductCommentsHandler,
    updateCommentHandler,
} from "./comment.controller.js";

const router = express.Router();

router.post("/", addCommentHandler);
router.get("/:productId", getProductCommentsHandler);

router.use(authAdmin);
router.get("/", getAllCommentHandler);
router.patch("/:id", updateCommentHandler);

export default router;
