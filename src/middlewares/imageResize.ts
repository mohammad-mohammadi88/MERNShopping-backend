import type { RequestHandler } from "express";
import fileUpload from "express-fileupload";
import { resolve } from "node:path";
import { cwd } from "node:process";
import { Worker } from "node:worker_threads";

import type { Images } from "@/request.js";
import { defaults } from "@/shared/index.js";

export interface WorkerValues {
    newGalleryImages: string[];
    action: Action;
    thumbnail: {
        name: string;
        data: Buffer;
        prevThumbnail: string | undefined;
    };
    isThumbnailDestroyed: boolean;
    gallery: { name: string; data: Buffer }[] | undefined;
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

        const { isThumbnailDestroyed, newGalleryImages, prevProduct } = req;
        const workerValues: WorkerValues = {
            action,
            newGalleryImages,
            thumbnail: {
                name: thumbnail.name,
                data: Buffer.from(thumbnail.data),
                prevThumbnail: prevProduct?.thumbnail,
            },
            isThumbnailDestroyed: !!isThumbnailDestroyed,
            gallery: gallery
                ? gallery.map((f) => ({
                      name: f.name,
                      data: Buffer.from(f.data),
                  }))
                : undefined,
        };

        worker.postMessage(workerValues);
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
