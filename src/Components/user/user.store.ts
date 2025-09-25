import errorHandler from "@/shared/errorHandler.js";
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
}

export default new UserStore();
