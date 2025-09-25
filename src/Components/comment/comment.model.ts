import { model } from "mongoose";

import type IComment from "./schema/comment.d.js";
import commentSchema from "./schema/comment.js";

export default model<IComment>("Comment", commentSchema);
