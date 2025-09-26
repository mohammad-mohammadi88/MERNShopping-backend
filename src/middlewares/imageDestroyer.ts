import type { Request, RequestHandler } from "express";
import type { UploadedFile } from "express-fileupload";

import { deleteImage } from "@/services/cloudinary/index.js";
import type { DestroyedImages } from "@/services/cloudinary/request.js";
import { getDecodedName, urlToPublicId } from "@/shared/index.js";
import productStore from "@Product/product.store.js";
import type { EditProductSchema } from "@Product/product.validate.js";

/**
 * Add to destroyedImages list in request
 * - if the value is boolean we asign thumbnail is to thumbnail, which shows if the thumbnail is destroyed or not
 * - if it is an array of string we asign it to gallery param.
 * - if it is a string we push it to gallery param.
 * This function can be used to add both thumbnail and gallery
 */
const markDestroyedImages = (
    req: Request,
    value: boolean | string[] | string
): void => {
    const destroyedImages =
        req?.destroyedImages ??
        ({
            thumbnail: undefined,
            gallery: [],
        } as DestroyedImages);
    if (typeof value === "boolean") destroyedImages.thumbnail = value;
    else if (typeof value === "string") destroyedImages?.gallery.push(value);
    else destroyedImages.gallery = value;
    req.destroyedImages = destroyedImages;
};

/**
 * Normalize gallery input.
 * express-fileupload returns an object when only one file is uploaded,
 * so this function ensures it is always an array.
 */
const normalizeGalleryInput = (
    gallery: UploadedFile[] | UploadedFile | undefined
): UploadedFile[] | undefined => {
    if (!gallery) return undefined;
    return Array.isArray(gallery) ? gallery : [gallery];
};

/**
 * Get the list of images to destroy when editing a product.
 * - If the new thumbnail is different from the old one, the old thumbnail should be destroyed.
 * - Any gallery image from the old product that does not exist in the new gallery should be destroyed.
 * - If no gallery is provided in the new data, all old gallery images should be destroyed.
 */
const getImagesToDestroyOnEdit = (
    prevProduct: { thumbnail: string; gallery?: string[] },
    thumbnail: UploadedFile | undefined,
    gallery: UploadedFile[] | undefined,
    req: Request
): string[] => {
    const images: string[] = [];

    // Check thumbnail
    // mark thumbnail as distroyed image
    if (thumbnail && getDecodedName(thumbnail) !== prevProduct.thumbnail) {
        images.push(prevProduct.thumbnail);
        markDestroyedImages(req, true);
    }

    // Check gallery
    if (gallery)
        prevProduct.gallery?.forEach((image) => {
            const exists = gallery.some(
                (file) => getDecodedName(file) === image
            );
            if (exists) return;
            images.push(image);
            markDestroyedImages(req, image);
        });
    // If no new gallery is provided, destroy all previous gallery images and add them to destroyedImages list
    else {
        prevProduct.gallery?.forEach((image) => images.push(image));
        markDestroyedImages(req, prevProduct.gallery as string[]);
    }

    return images;
};

/**
 * Get the list of images to destroy when deleting a product.
 * - Always destroy the thumbnail
 * - Always destroy all gallery images
 */
const getImagesToDestroyOnDelete = (prevProduct: {
    thumbnail: string;
    gallery?: string[];
}): string[] => {
    const images: string[] = [];
    images.push(prevProduct.thumbnail);
    prevProduct.gallery?.forEach((image) => images.push(image));
    return images;
};

const imageDestroyer: (
    action: "edit" | "delete"
) => RequestHandler<{ id: string }, string, EditProductSchema> =
    (action) => async (req, res, next) => {
        const id = req.params.id;

        // Get previous product
        const {
            status,
            data: prevProduct,
            error,
        } = await productStore.getProductById(id);

        if (error) return res.status(status).send(error);

        // this code will never return
        if (!prevProduct) return;

        const thumbnail = req.files?.thumbnail as UploadedFile | undefined;
        let gallery = req.files?.gallery as
            | UploadedFile[]
            | UploadedFile
            | undefined;

        if (!thumbnail && action === "edit")
            return res.status(400).send("Thumbnail is required");

        // Normalize gallery input
        gallery = normalizeGalleryInput(gallery);

        // Get list of images to destroy
        const images =
            action === "delete"
                ? getImagesToDestroyOnDelete(prevProduct)
                : getImagesToDestroyOnEdit(
                      prevProduct,
                      thumbnail,
                      gallery,
                      req
                  );

        // Destroy images from Cloudinary
        const imageDelete = images.map((image) =>
            deleteImage(urlToPublicId(image))
        );
        if (imageDelete.length > 0) await Promise.all(imageDelete);

        req.prevProduct = prevProduct;
        next();
    };

export default imageDestroyer;
