import { isValidObjectId, Types } from "mongoose";

export default <T>(fields: (keyof T)[], query: string) =>
    (fields as unknown[] as string[]).map((field) => ({
        [field]:
            field.includes("_id") && isValidObjectId(query)
                ? new Types.ObjectId(query)
                : new RegExp(query, "img"),
    }));
