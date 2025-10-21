import type { PipelineStage } from "mongoose";

interface CollectionPipeline {
    pipeline: PipelineStage[];
    searchFields: string[];
}
type PipelineNames = "user" | "orderProducts" | "product";
const pipelines: Record<PipelineNames, CollectionPipeline> = {
    user: {
        pipeline: [
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
        ],
        searchFields: [
            "user.firstName",
            "user.lastName",
            "user.email",
            "user.mobile",
        ],
    },
    orderProducts: {
        pipeline: [
            { $unwind: "$products" },
            {
                $lookup: {
                    from: "products",
                    localField: "products.product",
                    foreignField: "_id",
                    as: "products.product",
                },
            },
            { $unwind: "$products.product" },
            {
                $group: {
                    _id: "$_id",
                    doc: { $first: "$$ROOT" },
                    products: { $push: "$products" },
                },
            },
            { $addFields: { "doc.products": "$products" } },
            { $replaceRoot: { newRoot: "$doc" } },
        ],
        searchFields: ["couponCode"],
    },
    product: {
        pipeline: [
            {
                $lookup: {
                    from: "productcategories",
                    localField: "productCategory",
                    foreignField: "_id",
                    as: "productCategory",
                },
            },
            { $unwind: "$productCategory" },
        ],
        searchFields: [
            "title",
            "productCategory.title",
            "attrs.title",
            "attrs.description",
        ],
    },
};
export default pipelines;
