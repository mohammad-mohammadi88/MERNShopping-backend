import type { Document, Query } from "mongoose";
import errorHandler from "./errorHandler.js";
import type { GetDataWithPagination, Pagination } from "./index.js";

export type GetDataFn<T> = () => Query<(T & Document)[], T & Document>;
export default <T>(
    getDataFn: GetDataFn<T>,
    dataName: string,
    pagination?: Required<Pagination>
) =>
    errorHandler(async (): Promise<GetDataWithPagination<T>> => {
        const result = getDataFn();
        const totalDocs = (await result).length;
        if (!pagination)
            return {
                currentPage: 1,
                perPage: totalDocs,
                pages: 1,
                data: (await result) as unknown as T[],
            };

        const { page, perPage } = pagination;
        const pages = Math.ceil(totalDocs / perPage);
        const currentPage = pages === 0 ? 1 : Math.min(page, pages);
        const skip = (currentPage - 1) * perPage;
        const data = (await result.skip(skip).limit(perPage)) as unknown as T[];

        return { currentPage, perPage, pages, data };
    }, `getting ${dataName}s`);
