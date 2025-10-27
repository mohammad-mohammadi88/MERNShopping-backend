import {
    type Action,
    errorHandler,
    paginateData,
    type Pagination,
    pipelines,
    searchFields,
} from "@/shared/index.js";
import type { UpdateQuery } from "mongoose";
import { type IUser, type RegisterSchema, userModel } from "./index.js";

class UserStore {
    private getDataFn = (query: string) => () =>
        userModel.find(
            query !== ""
                ? { $or: searchFields(pipelines.user.searchFields, query) }
                : {}
        );

    getAllUsers = (query: string, pagination?: Required<Pagination>) =>
        paginateData(this.getDataFn(query), "users", pagination);

    getUserByEmail = (email: string) =>
        errorHandler(
            () => userModel.findOne({ email }).select("+password"),
            "getting user",
            {
                notFoundError: "no user exists with this email",
            }
        );

    registerUser = (data: RegisterSchema) =>
        errorHandler(() => userModel.create(data), "creating new user", {
            successStatus: 201,
        });

    getUserById = (id: string, password: boolean = false) =>
        errorHandler(
            () => {
                const selectQuery = userModel.findById(id);
                if (password) return selectQuery.select("password");
                return selectQuery;
            },
            "getting user by id",
            {
                notFoundError: `User with id #${id} not found`,
            }
        );

    deleteUser = (id: string) =>
        errorHandler(
            () => userModel.findByIdAndDelete(id),
            "while deleting user",
            { notFoundError: `User with id #${id} not found` }
        );

    editUser = (id: string, data: UpdateQuery<IUser>) =>
        errorHandler(
            () => userModel.findByIdAndUpdate(id, data, { new: true }),
            "editing user info",
            { notFoundError: `There is no use with id #${id}` }
        );

    changeTotalOrdersCount = (_id: string, action: Action = "increas") =>
        errorHandler(
            () =>
                userModel.findOneAndUpdate(
                    {
                        _id,
                        totalOrders: { $gt: action === "increas" ? -1 : 0 },
                    },
                    {
                        $inc: { totalOrders: action === "increas" ? 1 : -1 },
                    }
                ),
            `${action}ing totalOrders count`,
            { notFoundError: `User with id #${_id} not found` }
        );
}

export default new UserStore();
