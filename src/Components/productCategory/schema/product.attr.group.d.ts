import type { Document } from "mongoose";

export default interface IProductAttrGroup extends Document {
    title: string;
    attrs: string[];
}
