import type { Document } from "mongoose";

export default interface IProductColor extends Document {
    title: string;
    color: `#${string}`;
    priceEffect: number;
}
