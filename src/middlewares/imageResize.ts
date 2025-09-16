import type { RequestHandler } from "express";
import fileUpload from "express-fileupload";
import sharp from "sharp";

import { uploadToCloudinary } from "@/services/cloudinary/index.js";
import defaults from "@/shared/defaults.js";

const resize = async (file: fileUpload.UploadedFile): Promise<string> => {
    const processedImage = await sharp(file.data)
        .resize(2000)
        .jpeg({ quality: 50 })
        .toBuffer();
    return (await uploadToCloudinary(processedImage)).secure_url;
};

const imageResize: (action: "add" | "edit") => RequestHandler =
    (action) => async (req, res, next) => {
        const thumbnail = req.files?.thumbnail as fileUpload.UploadedFile;
        let gallery = req.files?.gallery as
            | fileUpload.UploadedFile[]
            | fileUpload.UploadedFile;
        const destroyedImages = req.destroyedImages;
        const prevProduct = req.prevProduct;
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

        if (!thumbnail || Array.isArray(thumbnail))
            return res.status(400).send("please send one thumbnail");

        const galleryUrls: string[] = [];

        // handle gallery images
        if (gallery) {
            if (!Array.isArray(gallery)) gallery = [gallery];
            else
                await Promise.all(
                    gallery.map(async (file) =>
                        galleryUrls.push(
                            action === "add" ||
                                (action === "edit" &&
                                    destroyedImages?.gallery.includes(
                                        decodeURIComponent(file.name)
                                    ))
                                ? await resize(file)
                                : decodeURIComponent(file.name)
                        )
                    )
                );
        }

        const thumbnailImage =
            action === "add" ||
            (action === "edit" && destroyedImages?.thumbnail)
                ? await resize(thumbnail)
                : (prevProduct?.thumbnail as string);
        req.images = {
            thumbnail: thumbnailImage,
            gallery: galleryUrls,
        };

        next();
    };
export default imageResize;
