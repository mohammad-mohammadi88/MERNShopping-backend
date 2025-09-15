import "express";

export interface Images {
    thumbnail: string;
    gallery: string[];
}
declare module "express-serve-static-core" {
    interface Request {
        // user: User;
        images: Images;
        // listing?: Listings;
        // message?: Omit<Message, "id" | "createdAt">;
    }
}
