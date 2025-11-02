import { Types, type PipelineStage } from "mongoose";

import {
    errorHandler,
    paginateData,
    pipelines,
    searchAggretion,
    type GetDataFn,
    type GetterFnParams,
    type PaginationWithStatus,
} from "@Shared";
import {
    commentModel,
    commentStatus,
    type AddCommentSchema,
    type CommentStatusValue,
    type IComment,
} from "./index.js";

export type NewCommentData = AddCommentSchema & { user: string };
type CommentProduct = { product?: string };
class CommentStore {
    addComment = (data: NewCommentData) =>
        errorHandler(() => commentModel.create(data), "creating new comment", {
            successStatus: 201,
        });

    updateStatus = (id: string, status: CommentStatusValue) =>
        errorHandler(
            () => commentModel.findByIdAndUpdate(id, { status }, { new: true }),
            "updating comment status",
            { notFoundError: `Comment with id #${id} not found` }
        );

    getSingleComment = (id: string) =>
        errorHandler(() => commentModel.findById(id), "getting comment", {
            notFoundError: `Comment with id #${id} not found`,
        });

    getAllComments = ({
        pagination,
        ...params
    }: PaginationWithStatus & GetterFnParams & CommentProduct) =>
        paginateData<IComment>(this.getterFns(params), "comments", pagination);

    private getterFns =
        ({
            query,
            status,
            product,
        }: GetterFnParams & CommentProduct): GetDataFn<IComment> =>
        () => {
            let pipeline: PipelineStage[] = [];
            if (status) pipeline = [{ $match: { status } }];
            if (product)
                pipeline = [
                    {
                        $match: {
                            product: new Types.ObjectId(product),
                            status: commentStatus.APPROVED,
                        },
                    },
                ];

            return this.searchData(query, pipeline) as any;
        };

    private searchData = (query: string, beforeSearch: PipelineStage[]) =>
        commentModel.aggregate(
            searchAggretion(
                [...beforeSearch, ...pipelines.commentProduct.pipeline],
                pipelines.commentProduct.searchFields,
                query
            )
        );
}

export default new CommentStore();
