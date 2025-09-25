import type { Document, Types } from "mongoose";
import type {
    CommentRecommendationValue,
    CommentStatusValue,
} from "../comment.constants.js";

export default interface IComment extends Document {
    user: Types.ObjectId;
    product: Types.ObjectId;
    title: string;
    body: string;
    isCustomer: boolean;
    createdAt: Date;
    recommendation: CommentRecommendationValue;
    status: CommentStatusValue;
}
