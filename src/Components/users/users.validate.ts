import z from "zod";

export const userAddressSchema = z.object({
    fullname: z.string(),
    title: z.string(),
    address: z.string(),
    state: z.string(),
    city: z.string(),
    mobile: z.string().min(11),
    zipCode: z.string().optional(),
});
export type UserAddressSchema = z.infer<typeof userAddressSchema>;
