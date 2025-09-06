import type { RequestHandler } from "express";
import type z from "zod";

const validation =
    <T>(schema: z.ZodType<T>): RequestHandler =>
    (req, res, next) => {
        const result = schema.safeParse(req.body ?? {});
        if (!result.success)
            return res
                .status(400)
                .json({ errors: result.error.issues.map((e) => e.message) });

        req.body = result.data as T;
        next();
    };

export default validation;
