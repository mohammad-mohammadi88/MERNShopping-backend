import { model } from "mongoose";

import { collections } from "@Shared";
import type IComment from "./schema/comment.d.js";
import commentSchema from "./schema/comment.js";

export default model<IComment>(collections.comment, commentSchema);
