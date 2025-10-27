import z from "zod";

const password = z
    .string()
    .min(10, "Your password must be at least 10 characters")
    .max(50, "Your password cannot be more than 50 characters")
    .superRefine((val, ctx) => {
        const addError = (message: string): any => ({
            code: "custom",
            message,
        });

        interface Validation {
            message: string;
            regex: RegExp;
        }
        const validations: Validation[] = [
            {
                message: "lower case word",
                regex: /[a-z]/,
            },
            {
                message: "upper case words",
                regex: /[A-Z]/,
            },
            {
                message: "numbers",
                regex: /[0-9]/,
            },
            {
                message: "special characters such as ;:/\\*%&",
                regex: /[!@#\$%\^&\*\(\)\-\_\+\=\[\]\{\}\\\|;:'",<\.>\/\?~`]/,
            },
        ];
        validations.forEach(
            ({ message, regex }) =>
                !regex.test(val) &&
                ctx.addIssue(addError(`Password must include ${message}`))
        );
    });
const phoneRegex = new RegExp(/^0?[1-9]\d{1,14}$/);
const mobile = z.string().regex(phoneRegex, "Invalid Phone number");

export const userAddressSchema = z
    .object({
        title: z.string(),
        address: z.string(),
        state: z.string(),
        city: z.string(),
        mobile: z.string().min(11),
        zipCode: z.string().optional(),
    })
    .strip();
export type UserAddressSchema = z.infer<typeof userAddressSchema>;

export const loginSchema = z
    .object({
        email: z.email(),
        password,
    })
    .refine(({ email, password }) => email !== password, {
        error: "Password cannot be your email address",
    });

export type LoginSchema = z.infer<typeof loginSchema>;

type RegisterRefineFields = keyof Omit<RegisterSchema, "password" | "mobile">;
export const registerSchema = z
    .object({
        email: z.email(),
        password,
        firstName: z.string(),
        lastName: z.string(),
        mobile,
    })
    .strip()
    .superRefine(({ password, ...values }, ctx) => {
        const getError = (field: string) =>
            `password cannot be same as your ${field}`;
        const fields: RegisterRefineFields[] = [
            "firstName",
            "lastName",
            "email",
        ];
        fields.forEach(
            (field) =>
                (field === "email"
                    ? values.email.split("@")[0] === password
                    : values[field] === password) &&
                ctx.addIssue(getError(field))
        );
    });

export type RegisterSchema = z.infer<typeof registerSchema>;

const auth = z
    .object({
        email: z.email(),
        password: z.object({
            prev: password,
            next: password,
        }),
    })
    .strip()
    .optional()
    .refine(
        (values) =>
            !values ||
            values.email !== values.password.next ||
            values.email !== values.password.prev,
        { error: "Password cannot be your email address" }
    );
export const userUpdateSchema = z
    .object({
        auth,
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        mobile: mobile.optional(),
        isAdmin: z.boolean().optional(),
        addresses: z.array(userAddressSchema).optional(),
    })
    .strip()
    .refine((obj) => Object.keys(obj).length > 0, {
        message: "You should send at least one field",
    });
export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;
