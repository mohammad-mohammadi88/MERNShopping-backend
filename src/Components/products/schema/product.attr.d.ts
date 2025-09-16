import type { Document } from "mongoose";

export default interface IProductAttr extends Document {
    title: string;
    description: string;
}
