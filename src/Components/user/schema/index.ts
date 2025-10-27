import type IUserAddress from "./user.address.d.js";
import type IUser from "./user.d.js";

export type FormatedUser = Omit<IUser, "password">;
export { type IUser, type IUserAddress };
