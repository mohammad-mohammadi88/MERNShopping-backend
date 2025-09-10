import type { RequestHandler } from "express";
import { z } from "zod";

const validation =
    <T>(schema: z.ZodType<T>): RequestHandler =>
    (req, res, next) => {
        z.setErrorMap((issue) => {
            switch (issue.code) {
                case "invalid_type":
                    console.log(issue);
                    return {
                        message: `${
                            issue?.path?.join(".") || "field"
                        } must be ${
                            issue.expected
                        }, but got ${typeof issue.input}`,
                    };
                case "too_small":
                    return {
                        message: `${
                            issue?.path?.join(".") || "field"
                        } is required`,
                    };
                default:
                    return { message: issue.message || "" };
            }
        });
        const result = schema.safeParse(req.body ?? {});
        if (!result.success)
            return res
                .status(400)
                .json({ errors: result.error.issues.map((e) => e.message) });

        req.body = result.data as T;
        next();
    };

export default validation;
