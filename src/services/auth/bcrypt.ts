import { compare, genSalt, hash } from "bcrypt";

const hashPassword = async (password: string) =>
    await hash(password, await genSalt());

export default {
    comparePassword: compare,
    hashPassword,
};
