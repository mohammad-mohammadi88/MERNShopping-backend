import express from "express";

import { auth, authAdmin, userIdAccess } from "@Middlewares";
import {
    deleteUserHandler,
    getAllCustomersHandler,
    getUserHandler,
    loginHandler,
    logoutHandler,
    registerHandler,
    updateUserHandler,
} from "./user.controller.js";

const router = express.Router();

router.post("/login", loginHandler);
router.post("/register", registerHandler);
router.get("/", getAllCustomersHandler);

router.use(auth);
// to get yourself info
router.get("/self", getUserHandler());
router.delete("/logout", logoutHandler);

// to get every ones info which is just available for admins
router.get("/:id", authAdmin, (...request) =>
    getUserHandler(request[0].params.id)(...request)
);

router.use("/:id", userIdAccess());
router.delete("/:id", deleteUserHandler);
router.patch("/:id", updateUserHandler);

export default router;
