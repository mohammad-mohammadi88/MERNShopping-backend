import type { Request, RequestHandler } from "express";
import fileUpload from "express-fileupload";
import sharp from "sharp";

import { uploadToCloudinary } from "@/services/cloudinary/index.js";
import { defaults, getDecodedName } from "@/shared/index.js";

// Resize the image to max width of 2000px, compress to 50% quality JPEG,
// upload to Cloudinary and return the secure_url.
const resize = async (file: fileUpload.UploadedFile): Promise<string> => {
    const processedImage = await sharp(file.data)
        .resize(2000)
        .jpeg({ quality: 50 })
        .toBuffer();
    return (await uploadToCloudinary(processedImage)).secure_url;
};

type Action = "add" | "edit";
/**
 * To handle the thumbnail that will be uploaded
 * - Always upload thumbnail while action is adding
 * - Always check if the thumbnail is same as previous product while action is editing
 */
const handleThumbnail = async (
    { destroyedImages, prevProduct }: Request,
    action: Action,
    thumbnail: fileUpload.UploadedFile
): Promise<string> =>
    action === "add" || (action === "edit" && destroyedImages?.thumbnail)
        ? await resize(thumbnail)
        : (prevProduct?.thumbnail as string);

/**
 * To handle the gallery images that will be uploaded
 * - Always convert single gallery item to array
 * - Always add upload all gallery images while action is adding
 * - Always check if any of the new gallery item is included in previous product while action is editing
 */
const handleGallery = async (
    { destroyedImages }: Request,
    action: Action,
    gallery: fileUpload.UploadedFile[]
): Promise<string[]> =>
    await Promise.all(
        gallery.map(async (file) =>
            action === "add" ||
            (action === "edit" &&
                destroyedImages?.gallery.includes(getDecodedName(file)))
                ? await resize(file)
                : getDecodedName(file)
        )
    );

const imageResize: (action: Action) => RequestHandler =
    (action) => async (req, res, next) => {
        const thumbnail = req.files?.thumbnail as fileUpload.UploadedFile;
        let gallery =
            req.files?.gallery ??
            ([] as fileUpload.UploadedFile[] | fileUpload.UploadedFile);

        if (
            gallery &&
            Array.isArray(gallery) &&
            gallery.length > defaults.maxGalleryLength
        )
            return res
                .status(400)
                .send(
                    `You can only send ${defaults.maxGalleryLength} images for gallery`
                );

        if (!req.files || !("thumbnail" in req.files))
            return res.status(400).send("Missing thumbnail field");

        // convert single gallery item to array
        if (!Array.isArray(gallery)) gallery = [gallery];

        const newImages = {
            thumbnail: await handleThumbnail(req, action, thumbnail),
            gallery: await handleGallery(req, action, gallery),
        };
        req.images = newImages;
        console.log("second");
        next();
    };

export default imageResize;
