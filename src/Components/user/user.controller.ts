import type { RequestHandler } from "express";

import type { GetDataWithPagination, Pagination } from "@/shared/index.js";
import paginationHandler from "@/shared/paginationHandler.js";
import { userStore, type IUser } from "./index.js";

// get all users
export const getUsersHandler: RequestHandler<
    null,
    string | GetDataWithPagination<IUser>,
    null,
    Pagination
> = async (req, res) => {
    const pagination = paginationHandler(req);
    const { status, data, error } = await userStore.getAllUsers(pagination);
    return res.status(status).send(data || error);
};
