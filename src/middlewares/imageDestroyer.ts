import type { Request, RequestHandler } from "express";
import type { UploadedFile } from "express-fileupload";

import { deleteImage } from "@/services/cloudinary/index.js";
import { getDecodedName, urlToPublicId } from "@/shared/index.js";
import productStore from "@Product/product.store.js";
import type { EditProductSchema } from "@Product/product.validate.js";

/**
 * Normalize gallery input.
 * express-fileupload returns an object when only one file is uploaded,
 * so this function ensures it is always an array.
 */
const normalizeGalleryInput = (
    gallery: UploadedFile[] | UploadedFile | undefined
): UploadedFile[] => {
    if (!gallery) return [];
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
    gallery: UploadedFile[],
    req: Request
): string[] => {
    req.newGalleryImages = [];
    const images: string[] = [];

    // Check thumbnail
    // mark thumbnail as distroyed image
    if (thumbnail && getDecodedName(thumbnail) !== prevProduct.thumbnail) {
        console.log("fffff", getDecodedName(thumbnail), prevProduct.thumbnail);
        images.push(prevProduct.thumbnail);
        req.isThumbnailDestroyed = true;
    }

    // add new gallery images to req.newGalleryImages
    gallery?.forEach((image) => {
        const name = getDecodedName(image);
        const isNewImage = !prevProduct.gallery?.includes(name);
        if (isNewImage) req.newGalleryImages.push(name);
    });

    // add images to destroy list
    prevProduct.gallery?.forEach((image) => {
        // If no new gallery is provided, destroy all previous gallery images
        if (!gallery) return images.push(image);

        if (!gallery.some((file) => getDecodedName(file) === image))
            images.push(image);
    });

    return images;
};

/**
 * Get the list of images to destroy when deleting a product.
 * - Always destroy the thumbnail
 * - Always destroy all gallery images
 */
const getImagesToDestroyOnDelete = ({
    thumbnail,
    gallery,
}: {
    thumbnail: string;
    gallery?: string[];
}): string[] => [thumbnail, ...(gallery || [])];

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
        if (!thumbnail && action === "edit")
            return res.status(400).send("Thumbnail is required");

        const gallery = normalizeGalleryInput(req.files?.gallery);

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
