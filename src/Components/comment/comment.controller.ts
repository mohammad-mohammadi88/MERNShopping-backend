import type { RequestHandler } from "express";

import {
    paginationHandler,
    type GetDataWithPagination,
    type IQuery,
    type Pagination,
    type Status,
} from "@/shared/index.js";
import { validateAsync } from "@Middlewares";
import {
    addCommentSchema,
    commentStatus,
    commentStore,
    updateCommentStatusSchema,
    type AddCommentSchema,
    type CommentStatusValue,
    type IComment,
    type NewCommentData,
    type UpdateCommentStatusSchema,
} from "./index.js";

// add comment
const addCommentCTRL: RequestHandler<
    null,
    string | IComment,
    AddCommentSchema
> = async (req, res) => {
    if (req.user.isAdmin)
        return res.status(401).send("Admins cannot send comments");

    const user = req.user.id;
    const newCommentInfo: NewCommentData = { ...req.body, user };

    const { status, data, error } = await commentStore.addComment(
        newCommentInfo
    );
    return res.status(status).send(data || error);
};
export const addCommentHandler: any[] = [
    validateAsync(addCommentSchema),
    addCommentCTRL,
];

// update comment status
const statusValidator = (
    newStatus: CommentStatusValue,
    oldStatus: CommentStatusValue
): void | string => {
    interface Validation {
        message: string;
        condition: boolean;
    }
    const validations: Validation[] = [
        {
            condition: oldStatus === newStatus,
            message:
                "You don't need to update comment status to the same state",
        },
        {
            condition: newStatus === commentStatus.PENDING,
            message: "You cannot update status to Pending",
        },
        {
            condition: oldStatus !== commentStatus.PENDING,
            message: "You cannot update fixed status",
        },
    ];
    try {
        validations.forEach(({ condition, message }) => {
            if (condition) throw message;
        });
    } catch (e) {
        return e as string;
    }
};
const updateCommentCTRL: RequestHandler<
    { id: string },
    string | IComment,
    UpdateCommentStatusSchema
> = async (req, res) => {
    const commentId = req.params.id;
    const newStatus = req.body.status;
    const {
        status: commentStatus,
        data: prevComment,
        error: commentError,
    } = await commentStore.getSingleComment(commentId);
    if (commentError || !prevComment)
        return res.status(commentStatus).send(commentError);
    const oldStatus = prevComment.status;

    const result = statusValidator(newStatus, oldStatus);
    if (result) return res.status(400).send(result);

    const { status, data, error } = await commentStore.updateStatus(
        commentId,
        newStatus
    );
    return res.status(status).send(data || error);
};
export const updateCommentHandler: any[] = [
    validateAsync(updateCommentStatusSchema),
    updateCommentCTRL,
];

// get all comments
export const getAllCommentHandler: RequestHandler<
    null,
    string | GetDataWithPagination<IComment>,
    null,
    Status & Pagination & IQuery
> = async (req, res) => {
    const reqStatus = req.query.status;
    const query = req.query.query || "";

    const pagination = paginationHandler(req);
    const { status, data, error } = await commentStore.getAllComments({
        status: reqStatus ? Number(reqStatus) : undefined,
        query,
        pagination,
    });
    return res.status(status).send(data || error);
};

// get product comments
export const getProductCommentsHandler: RequestHandler<
    { productId: string },
    string | GetDataWithPagination<IComment>,
    null,
    Pagination & IQuery
> = async (req, res) => {
    const product = req.params.productId;
    const query = req.query.query || "";
    const isAdmin = req.user.isAdmin;

    const pagination = paginationHandler(req);
    const { status, data, error } = await commentStore.getAllComments({
        status: isAdmin ? undefined : commentStatus.APPROVED,
        product,
        query,
        pagination,
    });
    return res.status(status).send(data || error);
};

// get single comment
export const getSingleCommentHandler: RequestHandler<
    { id: string },
    string | IComment
> = async (req, res) => {
    const id = req.params.id;
    const { status, data, error } = await commentStore.getSingleComment(id);
    return res.status(status).send(data || error);
};
