import { type Action, errorHandler } from "@/shared/index.js";
import userModel from "./user.model.js";

class UserStore {
    getAllUsers = () =>
        errorHandler(() => userModel.find(), "getting users list");

    postUser = (data: any) =>
        errorHandler(() => userModel.create(data), "creating new user", {
            successStatus: 201,
        });

    getUserById = (id: string) =>
        errorHandler(() => userModel.findById(id), "getting user by id", {
            notFoundError: `User with id #${id} not found`,
        });

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
