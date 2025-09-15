import type { RequestHandler } from "express";

import productStore from "@/Components/products/products.db.js";
import deleteImage from "@/services/cloudinary/deleteImage.js";
import urlToPublicId from "@/shared/urlToPublicId.js";

const imageDestroyer: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
) => {
    const id = req.params.id;
    const value = await productStore.getProductById(id);
    if (typeof value === "string") return res.status(500).send(value);
    if (value === null)
        return res.status(404).send(`Product with id #${id} doesn't exists!`);

    const images: string[] = [];
    images.push(value.thumbnail);
    value.gallery?.forEach((item) => images.push(item));

    const imageDelete = images.map(async (image) => {
        await deleteImage(urlToPublicId(image));
        return;
    });
    if (imageDelete) await Promise.all([...imageDelete]);

    next();
};
export default imageDestroyer;
