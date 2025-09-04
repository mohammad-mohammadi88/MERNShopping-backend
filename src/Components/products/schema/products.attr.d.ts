import type { Document } from "mongoose";

export default interface IProductAttr extends Document {
    title: string;
    name: string;
    filterable: boolean;
    isMultiple: boolean;
}
