import type { RequestHandler } from "express";
import type { ObjectId, UpdateQuery } from "mongoose";

import type { AuthUser } from "@/request.js";
import { cryptoPassword, jwtToken } from "@/services/index.js";
import { authAdmin, validate } from "@Middlewares";
import {
    paginationHandler,
    type GetDataWithPagination,
    type IQuery,
    type Pagination,
} from "@Shared";
import {
    loginSchema,
    registerSchema,
    userCookie,
    userStore,
    userUpdateSchema,
    type IUser,
    type LoginSchema,
    type RegisterSchema,
    type UserUpdateSchema,
} from "./index.js";

// get all Customers
const getAllCustomersCTRL: RequestHandler<
    null,
    string | GetDataWithPagination<IUser>,
    null,
    Pagination & IQuery
> = async (req, res) => {
    const pagination = paginationHandler(req);
    const query = req.query.query || "";

    const { status, data, error } = await userStore.getAllCustomers(
        query,
        pagination
    );
    return res.status(status).send(data || error);
};
export const getAllCustomersHandler: any[] = [authAdmin, getAllCustomersCTRL];

// get user
export const getUserHandler =
    (id?: string): RequestHandler =>
    async (req, res) => {
        const { status, data, error } = await userStore.getUserById(
            id || req.user.id
        );
        return res.status(status).send(data || error);
    };

// delete user
export const deleteUserHandler: RequestHandler<{ id: string }, string> = async (
    req,
    res
) => {
    const id = req.params.id;

    const { status, error } = await userStore.deleteUser(id);
    return res.status(status).send(error || "User deleted successfully");
};

// update user
const updateUserCTRL: RequestHandler<
    { id: string },
    string,
    UserUpdateSchema
> = async (req, res) => {
    const id = req.params.id;

    // to get user info
    const {
        status: userStatus,
        data: user,
        error: userError,
    } = await userStore.getUserById(id, true);
    if (userError || !user) return res.status(userStatus).send(userError);

    if (req.user.id !== id && user.isAdmin)
        return res.status(403).send("You cannot update another admins info");

    const { auth, isAdmin: requestIsAdmin, ...info } = req.body;
    let updateUserFields: UpdateQuery<IUser> = info;

    if (auth) {
        const {
            email,
            password: { next, prev },
        } = auth;

        if (!req.user.isAdmin) {
            // to check prev password
            const isPasswordCorrect = await cryptoPassword.comparePassword(
                prev,
                user.password
            );
            if (!isPasswordCorrect)
                return res.status(400).send("Password is wrong");
        }

        // update with new password
        updateUserFields.email = email;
        updateUserFields.password = await cryptoPassword.hashPassword(next);
    }

    // only a admin can make someone admin
    if (req.user.isAdmin && requestIsAdmin !== undefined)
        updateUserFields.isAdmin = requestIsAdmin;

    const { status, data, error } = await userStore.editUser(
        id,
        updateUserFields
    );
    if (error || !data) return res.status(status).send(error);

    if (req.user.id === id) {
        const { email, firstName, lastName, mobile, isAdmin } = data;
        const tokenData: AuthUser = {
            id,
            email,
            firstName,
            lastName,
            mobile,
            isAdmin,
        };
        const token = jwtToken.generateToken(tokenData);
        res.setHeader("Set-Cookie", userCookie.serialize(token));
    }
    return res.status(200).send("ok");
};
export const updateUserHandler: any[] = [
    validate(userUpdateSchema),
    updateUserCTRL,
];

// login user
const loginCTRL: RequestHandler<null, string, LoginSchema> = async (
    req,
    res
) => {
    const { email, password, adminPanel } = req.body;
    const { status, data, error } = await userStore.getUserByEmail(email);
    if (error || !data) return res.status(status).send(error);
    if (adminPanel && !data.isAdmin)
        return res.status(403).send("Normal user cannot use admin panel");

    const isPasswordCorrect = await cryptoPassword.comparePassword(
        password,
        data.password
    );
    if (!isPasswordCorrect) return res.status(400).send("Incorrect password");

    const { firstName, lastName, isAdmin, mobile } = data;
    const tokenData: AuthUser = {
        id: (data?._id as ObjectId).toString(),
        firstName,
        email,
        mobile,
        lastName,
        isAdmin,
    };
    const token = jwtToken.generateToken(tokenData);
    res.setHeader("Set-Cookie", userCookie.serialize(token));
    return res.status(200).send("ok");
};
export const loginHandler: any[] = [validate(loginSchema), loginCTRL];

// register user
const registerCTRL: RequestHandler<null, string, RegisterSchema> = async (
    req,
    res
) => {
    const { password, email, ...userInfo } = req.body;
    const {
        status: userStatus,
        data: prevUser,
        error: userError,
    } = await userStore.getUserByEmail(email);

    // when user is not found this block will not work
    if (userStatus !== 404) {
        // to check if we have error other than not found
        if (userError) return res.status(userStatus).send(userError);

        if (prevUser)
            return res
                .status(429)
                .send(`User with email "${email}" already exists`);
    }
    const encryptedPassword = await cryptoPassword.hashPassword(password);
    const { status, data, error } = await userStore.registerUser({
        ...userInfo,
        email,
        password: encryptedPassword,
    });
    if (error) return res.status(status).send(error);

    const tokenData: AuthUser = {
        ...userInfo,
        email,
        id: (data?._id as ObjectId).toString(),
        isAdmin: false,
    };
    const token = jwtToken.generateToken(tokenData);
    res.setHeader("Set-Cookie", userCookie.serialize(token));
    return res.status(201).send("ok");
};
export const registerHandler: any[] = [validate(registerSchema), registerCTRL];

// logout => delete token
export const logoutHandler: RequestHandler = (_, res) => {
    res.setHeader("Set-Cookie", userCookie.deleteToken());
    return res.status(200).send("logged out");
};
