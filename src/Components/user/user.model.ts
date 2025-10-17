import { model } from "mongoose";

import collections from "@/shared/collections.js";
import type IUser from "./schema/user.d.js";
import userSchema from "./schema/user.js";

export default model<IUser>(collections.user, userSchema);
