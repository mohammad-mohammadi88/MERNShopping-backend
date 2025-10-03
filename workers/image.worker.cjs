const sharp = require("sharp");
const { v2: cloudinary } = require("cloudinary");
const { parentPort } = require("worker_threads");

const platform = process.env.NODE_ENV;
const rootFolder = platform === "production" ? "dist" : "src";

const {
    default: uploadToCloudinary,
} = require(`../${rootFolder}/services/cloudinary/uploadImage`);
const {
    default: getDecodedName,
} = require(`../${rootFolder}/shared/getDecodedName`);
const { default: defaults } = require(`../${rootFolder}/shared/defaults`);

// reconfig for commonjs
cloudinary.config(defaults.cloudinary);

// Resize the image to max width of 1000px, compress to 80% quality JPEG,
// upload to Cloudinary and return the secure_url.
const resize = async ({ data }) => {
    const processedImage = await sharp(data)
        .resize(1000)
        .jpeg({ quality: 80 })
        .toBuffer();
    const secure_url = (await uploadToCloudinary(processedImage)).secure_url;
    console.log("🚀 ~ resize ~ secure_url:", secure_url);
    return secure_url;
};

/**
 * To handle the thumbnail that will be uploaded
 * - Always upload thumbnail while action is adding
 * - Always check if the thumbnail is same as previous product while action is editing
 */
const handleThumbnail = async (action, isThumbnailDestroyed, thumbnail) =>
    action === "add" || (action === "edit" && isThumbnailDestroyed)
        ? await resize(thumbnail)
        : thumbnail.prevThumbnail;

/**
 * To handle the gallery images that will be uploaded
 * - Always convert single gallery item to array
 * - Always add upload all gallery images while action is adding
 * - Always check if any of the new gallery item is included in previous product while action is editing
 */
const handleGallery = async (newGalleryImages, action, gallery) =>
    await Promise.all(
        gallery.map(async (file) => {
            const name = getDecodedName(file);
            const ss =
                action === "add" ||
                (action === "edit" && newGalleryImages.includes(name));
            console.log("🚀 ~ handleGallery ~ ss:", ss);
            return ss ? await resize(file) : name;
        })
    );

parentPort?.on(
    "message",
    async ({
        action,
        newGalleryImages,
        isThumbnailDestroyed,
        gallery,
        thumbnail,
    }) => {
        console.log(
            "data",
            action,
            isThumbnailDestroyed,
            thumbnail.prevThumbnail
        );
        const handledGallery = gallery
            ? await handleGallery(newGalleryImages, action, gallery)
            : [];
        try {
            const newImage = {
                thumbnail: await handleThumbnail(
                    action,
                    isThumbnailDestroyed,
                    thumbnail
                ),
                gallery: handledGallery,
            };
            parentPort?.postMessage(newImage);
        } catch (e) {
            const error =
                e instanceof Error
                    ? e.message
                    : typeof e === "string"
                    ? e
                    : "Unexpexted error happend while saving pictures";
            parentPort?.postMessage(error);
        }
    }
);
