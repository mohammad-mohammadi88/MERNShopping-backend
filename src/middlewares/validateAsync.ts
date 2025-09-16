import type { RequestHandler } from "express";
import { z } from "zod";

export default <T>(schema: z.ZodType<T>): RequestHandler =>
    async (req, res, next) => {
        z.setErrorMap((issue) => {
            switch (issue.code) {
                case "invalid_type":
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

                case "custom":
                    return {
                        message: issue.message || "Custom validation failed",
                    };

                default:
                    return { message: issue.message || "" };
            }
        });
        try {
            const result = await schema.safeParseAsync(req.body);
            if (!result.success) {
                const isNotFound = result.error.issues.some(
                    (issue) =>
                        issue.code === "custom" &&
                        issue.message.toLowerCase().includes("not found")
                );
                return res.status(isNotFound ? 404 : 400).json({
                    errors: result.error.issues.map((e) => e.message),
                });
            }

            req.body = result.data as T;
            return next();
        } catch (err) {
            const errors =
                typeof err === "string"
                    ? [err]
                    : err instanceof Error
                    ? err.message
                    : err instanceof z.ZodError
                    ? err.issues.map((e) => e.message)
                    : ["Unexpected error happend while validating data"];
            return res.status(500).send({ errors });
        }
    };
