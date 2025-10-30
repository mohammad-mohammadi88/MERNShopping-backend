import { jwtToken } from "@/services/index.js";
import cookie from "cookie";

import type { Request, RequestHandler } from "express";

const getToken = (req: Request) =>
    (req.headers.cookie && cookie.parse(req.headers.cookie)?.token) ||
    // to set token in postman
    req.headers.authorization?.slice(7);

const validateToken = (token: string | undefined) => {
    try {
        if (!token) return "Token is missing";
        return jwtToken.verifyToken(token);
    } catch (e) {
        return typeof e === "string"
            ? e
            : e instanceof Error
            ? e.message
            : "Invalid token";
    }
};
export const auth: RequestHandler = async (req, res, next) => {
    const user = validateToken(getToken(req));
    if (typeof user === "string") return res.status(400).send(user);

    req.user = user;
    next();
};

export const authAdmin: RequestHandler = async (req, res, next) => {
    const user = validateToken(getToken(req));
    if (typeof user === "string") return res.status(400).send(user);

    if (!user.isAdmin)
        return res.status(401).send("You cannot access this route");

    req.user = user;
    next();
};

export const userIdAccess =
    (id?: string): RequestHandler<{ id: string }> =>
    (req, res, next) => {
        const userId = req.user.id;
        const idCondittion = userId !== (id ?? req.params.id);
        const userNotAllowed = !req.user.isAdmin && idCondittion;
        if (userNotAllowed)
            return res.status(401).send("You cannot access this action");

        next();
    };
