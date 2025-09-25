export const commentRecommendation = {
    YES: 0,
    NOT_SURE: 1,
    NO: 2,
} as const;
type CommentRecommendation = typeof commentRecommendation;
export type CommentRecommendationKey = keyof CommentRecommendation;
export type CommentRecommendationValue =
    CommentRecommendation[CommentRecommendationKey];

export const commentStatus = {
    PENDING: 0,
    APPROVED: 1,
    REJECTED: 2,
} as const;
type CommentStatus = typeof commentStatus;
export type CommentStatusKey = keyof CommentStatus;
export type CommentStatusValue = CommentStatus[CommentStatusKey];
