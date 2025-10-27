import jwt from "jsonwebtoken";

import type { AuthUser } from "@/request.js";
import { defaults } from "@Shared";

const jwtPrivate = defaults.jwtPrivate;

const expiresIn = "2d";
const generateToken = (payload: AuthUser) =>
    jwt.sign(payload, jwtPrivate, { expiresIn });

const verifyToken = (token: string) =>
    jwt.verify(token, jwtPrivate) as AuthUser;

export default {
    generateToken,
    verifyToken,
};
