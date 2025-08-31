import { model } from "mongoose";
import userSchema from "../schema/users.js";

const UserModel = model("User", userSchema);
export default UserModel;
