import { z } from "zod";

import { userSchema } from "@/shared/schema.js";

const discountSchema = z
    .object({
        role: z.enum(
            ["number", "percent"],
            `discount.role should be one of number or percent`
        ),
        amount: z.number().nonnegative(),
    })
    .refine((data) => data.role === "number" || data.amount <= 100, {
        message: "For 'percent', amount must be between 0 and 100",
        path: ["amount"],
    });

export type Discount = z.infer<typeof discountSchema>;

const constraintsSchema = z.object({
    user: userSchema,
});
export type Constraints = z.infer<typeof constraintsSchema>;

export const postCouponSchema = z.object({
    discount: discountSchema,
    limit: z.number().nonnegative().int("limit cannot be a float"),
    expiresAt: z.preprocess((val) => {
        if (typeof val === "string" || typeof val === "number") {
            const d = new Date(val);
            if (!isNaN(d.getTime())) return d;
        }
        return val;
    }, z.date()),
    constraints: constraintsSchema,
});
export type PostCouponSchema = z.infer<typeof postCouponSchema>;
