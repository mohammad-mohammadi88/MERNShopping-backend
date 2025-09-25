import type { Document } from "mongoose";

export default interface ISetting extends Document {
    key: string;
    value: string;
    version?: string | undefined;
    isPublic: boolean;
}
