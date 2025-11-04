import type { UpdateQuery } from "mongoose";

import {
    type Action,
    errorHandler,
    paginateData,
    type Pagination,
    pipelines,
    searchFields,
} from "@Shared";
import {
    type FormatedUser,
    type IUser,
    type RegisterSchema,
    userModel,
} from "./index.js";

class UserStore {
    private getDataFn = (query: string) => () =>
        userModel.find({
            $or:
                query !== ""
                    ? searchFields(pipelines.user.searchFields, query)
                    : [],
            isAdmin: false,
        });

    getAllCustomers = (query: string, pagination?: Required<Pagination>) =>
        paginateData(this.getDataFn(query), "customers", pagination);

    getUserByEmail = (email: string) =>
        errorHandler(
            () =>
                userModel
                    .findOne({ email })
                    .select("+password")
                    .lean<IUser>()
                    .exec(),
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
                let selectQuery = userModel.findById(id);
                if (password) selectQuery = selectQuery.select("+password");
                return selectQuery.exec();
            },
            "getting user by id",
            { notFoundError: `User with id #${id} not found` }
        );

    deleteUser = (id: string) =>
        errorHandler(
            () => userModel.findByIdAndDelete(id).lean<FormatedUser>().exec(),
            "while deleting user",
            { notFoundError: `User with id #${id} not found` }
        );

    editUser = (id: string, data: UpdateQuery<IUser>) =>
        errorHandler(
            () =>
                userModel
                    .findByIdAndUpdate(id, data, { new: true })
                    .lean<FormatedUser>()
                    .exec(),
            "editing user info",
            { notFoundError: `There is no use with id #${id}` }
        );

    isUserExists = async (_id: string): Promise<boolean> =>
        !!(await userModel.exists({ _id }).exec())?._id;

    changeTotalOrdersCount = (_id: string, action: Action = "increas") =>
        errorHandler(
            () =>
                userModel
                    .findOneAndUpdate(
                        {
                            _id,
                            totalOrders: { $gt: action === "increas" ? -1 : 0 },
                        },
                        {
                            $inc: {
                                totalOrders: action === "increas" ? 1 : -1,
                            },
                        },
                        { new: true }
                    )
                    .lean<FormatedUser>()
                    .exec(),
            `${action}ing totalOrders count`,
            { notFoundError: `User with id #${_id} not found` }
        );
}

export default new UserStore();
