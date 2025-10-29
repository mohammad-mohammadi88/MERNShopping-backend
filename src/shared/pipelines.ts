import type { PipelineStage } from "mongoose";

interface CollectionPipeline {
    pipeline: PipelineStage[];
    searchFields: string[];
}
type PipelineNames = "user" | "orderProducts" | "product" | "commentProduct";

const userPipeline = [
    {
        $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
        },
    },
    { $unwind: "$user" },
];
const userSearchFields = [
    "user.firstName",
    "user.lastName",
    "user.email",
    "user.mobile",
];
const pipelines: Record<PipelineNames, CollectionPipeline> = {
    user: {
        pipeline: userPipeline,
        searchFields: userSearchFields,
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
            "attrs.title",
            "attrs.description",
            "productCategory.title",
        ],
    },
    commentProduct: {
        pipeline: [
            ...userPipeline,
            {
                $lookup: {
                    from: "products",
                    localField: "product",
                    as: "product",
                    foreignField: "_id",
                },
            },
            { $unwind: "$product" },
            {
                $lookup: {
                    from: "productcategories",
                    localField: "product.productCategory",
                    foreignField: "_id",
                    as: "product.productCategory",
                },
            },
            { $unwind: "$product.productCategory" },
        ],
        searchFields: [
            ...userSearchFields,
            "product.productCategory.title",
            "product.productCategory.attrs.title",
            "product.productCategory.attrs.description",
            "title",
            "body",
        ],
    },
};
export default pipelines;
