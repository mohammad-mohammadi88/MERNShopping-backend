import type { Request } from "express";
import type { Pagination } from "./index.js";
const check = (i: number): boolean => i < 1 || !Number.isInteger(i);

export default (
    req: Request<any, any, any, Pagination>
): Required<Pagination> | undefined => {
    let pagination: Required<Pagination> | undefined = {
        page: Number(req.query.page) ?? -1,
        perPage: Number(req.query.perPage) ?? -1,
    };
    if (check(pagination.page) || check(pagination.perPage))
        pagination = undefined;
    return pagination;
};
