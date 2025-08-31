import type { Document } from "mongoose";

export default interface ProductAttrType extends Document {
    title: string;
    name: string;
    filterable: boolean;
    isMultiple: boolean;
}
