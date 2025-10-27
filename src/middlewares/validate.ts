import type { RequestHandler } from "express";
import { z } from "zod";

export default <T>(schema: z.ZodType<T>): RequestHandler =>
    (req, res, next) => {
        z.setErrorMap((issue) => {
            const name = issue?.path?.join(".") || "field";
            switch (issue.code) {
                case "invalid_type":
                    const message =
                        typeof issue.input === "undefined"
                            ? `${name} is required`
                            : `${name} must be ${
                                  issue.expected
                              }, but got ${typeof issue.input}`;
                    return { message };

                case "too_small":
                    return { message: `${name} is required` };

                case "invalid_format":
                    return { message: `${name} is invalid` };

                default:
                    return { message: issue.message || "" };
            }
        });
        const result = schema.safeParse(req.body);
        if (!result.success)
            return res.status(400).json({
                errors: result.error.issues
                    .map((e) => e.message)
                    .filter((e) => e),
            });

        req.body = result.data as T;
        next();
    };
