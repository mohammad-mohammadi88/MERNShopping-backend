import type { RequestHandler } from "express";
import fileUpload from "express-fileupload";
import { resolve } from "node:path";
import { cwd } from "node:process";
import { Worker } from "node:worker_threads";

import type { DestroyedImages, Images } from "@/services/cloudinary/request.js";
import { defaults } from "@/shared/index.js";
import type IProduct from "@Products/schema/products.d.js";

export interface WorkerValues {
    destroyedImages: DestroyedImages | undefined;
    action: Action;
    thumbnail: { name: string; data: Buffer };
    prevProduct: IProduct | undefined;
    gallery: { name: string; data: Buffer }[];
}

type Action = "add" | "edit";
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

        const worker = new Worker(resolve(cwd(), "./workers/image.worker.cjs"));

        const { destroyedImages, prevProduct } = req;
        const workerValues: WorkerValues = {
            action,
            destroyedImages,
            prevProduct,
            thumbnail: { name: thumbnail.name, data: thumbnail.data },
            gallery: gallery.map((f) => ({ name: f.name, data: f.data })),
        };

        worker.postMessage(workerValues, [
            thumbnail.data.buffer as unknown as ArrayBuffer,
            ...gallery.map((f) => f.data.buffer as unknown as ArrayBuffer),
        ]);
        const handleError = ({ message }: Error) => {
            worker.terminate();
            return res.status(500).send(message);
        };
        worker.on("message", (value: string | Images) => {
            // error check
            if (typeof value === "string")
                return handleError({ message: value, name: "error" });

            worker.terminate();
            req.images = value;
            next();
        });
        worker.on("error", handleError);
        worker.on("messageerror", handleError);
    };

export default imageResize;
