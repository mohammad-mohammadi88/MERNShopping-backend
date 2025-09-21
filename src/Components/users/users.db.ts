import errorHandler from "@/shared/errorHandler.js";
import UserModel from "./model/users.model.js";

class UsersStore {
    getAllUsers = () =>
        errorHandler(() => UserModel.find(), "getting users list");

    postUser = (data: any) =>
        errorHandler(() => UserModel.create(data), "creating new user", {
            successStatus: 201,
        });

    getUserById = (id: string) =>
        errorHandler(() => UserModel.findById(id), "getting user by id", {
            notFoundError: `User with id #${id} not found`,
        });
}

const usersStore = new UsersStore();
export default usersStore;
