import { Schema } from "mongoose";
import type ISetting from "./setting.d.js";

const settingSchema = new Schema<ISetting>({
    key: { type: String, required: true },
    value: { type: String, required: true },
    version: { type: String, required: false },
    isPublic: { type: Boolean, default: true },
});
export default settingSchema;
