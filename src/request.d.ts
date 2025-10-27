import type IProduct from "@Product/schema/product.d.js";
import "express";

export interface Images {
    thumbnail: string;
    gallery: string[];
}
export interface AuthUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isAdmin: boolean;
    mobile: string;
}
declare module "express-serve-static-core" {
    interface Request {
        user: AuthUser;
        images: Images;
        prevProduct?: IProduct;
        newGalleryImages: string[];
        isThumbnailDestroyed?: boolean;
    }
}
