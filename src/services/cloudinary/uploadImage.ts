import defaults from "@/shared/defaults.js";
import {
    v2 as cloudinary,
    type UploadApiErrorResponse,
    type UploadApiResponse,
} from "cloudinary";
import streamifier from "streamifier";

const uploadToCloudinary = async (
    buffer: Buffer
): Promise<UploadApiResponse | UploadApiErrorResponse> =>
    await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: defaults.cloudinaryFolder },
            (error, result) => (result ? resolve(result) : reject(error))
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
export default uploadToCloudinary;
