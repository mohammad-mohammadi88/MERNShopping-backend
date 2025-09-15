import { v2 as cloudinary, type DeleteApiResponse } from "cloudinary";

const deleteImage = async (public_id: string): Promise<DeleteApiResponse> =>
    await new Promise(
        async (resolve, reject) =>
            await cloudinary.uploader.destroy(
                public_id,
                undefined,
                (error, result) => {
                    if (result) resolve(result);
                    else reject(error);
                }
            )
    );

export default deleteImage;
