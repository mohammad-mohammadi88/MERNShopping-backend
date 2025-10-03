import type IProduct from "@Product/schema/product.d.js";
import "express";

export interface Images {
    thumbnail: string;
    gallery: string[];
}
declare module "express-serve-static-core" {
    interface Request {
        // user: User;
        images: Images;
        prevProduct?: IProduct;
        newGalleryImages: string[];
        isThumbnailDestroyed?: boolean;
    }
}
