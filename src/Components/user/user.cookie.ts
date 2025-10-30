import cookie from "cookie";

const serialize = (token: string) =>
    cookie.serialize("token", token, {
        // 20 days
        maxAge: 20 * 24 * 60 * 60,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
    });

export default { serialize };
