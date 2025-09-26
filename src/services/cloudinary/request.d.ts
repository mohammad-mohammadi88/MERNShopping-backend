import type IProduct from "@Product/schema/product.d.js";
import "express";

export interface Images {
    thumbnail: string;
    gallery: string[];
}
export interface DestroyedImages {
    thumbnail: boolean | undefined;
    gallery: string[];
}
declare module "express-serve-static-core" {
    interface Request {
        // user: User;
        images: Images;
        prevProduct?: IProduct;
        destroyedImages?: DestroyedImages;
    }
}
