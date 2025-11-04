import cookie from "cookie";

const path = "/";
const serialize = (token: string) =>
    cookie.serialize("token", token, {
        // 20 days
        maxAge: 20 * 24 * 60 * 60,
        httpOnly: true,
        // sameSite: "none",
        path,
    });

const deleteToken = () => cookie.serialize("token", "", { maxAge: 0, path });

export default { serialize, deleteToken };
