import { model } from "mongoose";
import type IUser from "./schema/user.d.js";
import userSchema from "./schema/user.js";

export default model<IUser>("User", userSchema);
