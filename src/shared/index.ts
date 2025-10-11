export { default as capitalize } from "./capitalize.js";
export { default as defaults } from "./defaults.js";
export * from "./errorHandler.js";
export { default as errorHandler } from "./errorHandler.js";
export { default as getDecodedName } from "./getDecodedName.js";
export { default as mongooseConnection } from "./mongoose.connection.js";
export * from "./paginateData.js";
export { default as paginateData } from "./paginateData.js";
export { default as paginationHandler } from "./paginationHandler.js";
export { default as redisConnection } from "./redis.js";
export { default as reference } from "./reference.js";
export * from "./schema.js";
export { default as searchFields } from "./searchFields.js";
export { default as statusSchema } from "./statusSchema.js";
export { default as urlToPublicId } from "./urlToPublicId.js";

// I will use it as `${action}ing`
export type Action = "increas" | "decreas";

export interface GetDataWithPagination<T> {
    pages: number;
    data: T[];
    perPage: number;
    currentPage: number;
}
export interface Pagination {
    perPage?: number;
    page?: number;
}
export interface Status {
    status: string;
}
export interface PaginationWithStatus {
    status?: number;
    pagination?: Required<Pagination>;
}
export interface IQuery {
    query: string;
}
