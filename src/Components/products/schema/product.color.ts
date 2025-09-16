import { Schema } from "mongoose";
import type IProductColor from "./product.color.d.js";

const productColorSchema: Schema<IProductColor> = new Schema({
    title: { type: String, required: true },
    color: {
        type: String,
        required: true,
        match: /^#(?:[0-9a-fA-F]{3}){1,2}$/,
    }, // #RGB or #RRGGBB
    priceEffect: { type: Number, default: 0 },
});

export default productColorSchema;
