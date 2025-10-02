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

// // Resize the image to max width of 2000px, compress to 50% quality JPEG,
// upload to Cloudinary and return the secure_url.
const resize = async (data) => {
    const processedImage = await sharp(data)
        .resize(1000)
        .jpeg({ quality: 50 })
        .toBuffer();
    return (await uploadToCloudinary(processedImage)).secure_url;
};

/**
 * To handle the thumbnail that will be uploaded
 * - Always upload thumbnail while action is adding
 * - Always check if the thumbnail is same as previous product while action is editing
 */
const handleThumbnail = async (
    destroyedImages,
    prevThumbnail,
    action,
    thumbnail
) =>
    action === "add" || (action === "edit" && destroyedImages?.thumbnail)
        ? await resize(thumbnail)
        : prevThumbnail;

/**
 * To handle the gallery images that will be uploaded
 * - Always convert single gallery item to array
 * - Always add upload all gallery images while action is adding
 * - Always check if any of the new gallery item is included in previous product while action is editing
 */
const handleGallery = async (destroyedImages, action, gallery) =>
    await Promise.all(
        gallery.map(async (file) =>
            action === "add" ||
            (action === "edit" &&
                destroyedImages?.gallery.includes(getDecodedName(file)))
                ? await resize(file)
                : getDecodedName(file)
        )
    );

parentPort?.on(
    "message",
    async ({ action, destroyedImages, gallery, prevThumbnail, thumbnail }) => {
        try {
            const newImage = {
                thumbnail: await handleThumbnail(
                    destroyedImages,
                    prevThumbnail,
                    action,
                    thumbnail
                ),
                gallery: await handleGallery(destroyedImages, action, gallery),
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
