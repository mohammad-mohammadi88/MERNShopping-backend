import { UserHandler, ExpireHandler, LimitHandler } from "./handlers/index.js";
import type ICoupon from "@Coupon/schema/coupon.d.js";
import type IUser from "@Users/schema/users.d.js";

export default class CouponValidator {
    handler = (user: IUser, coupon: ICoupon) => {
        const userHandler = new UserHandler();
        const limitHandler = new LimitHandler();
        const expireHandler = new ExpireHandler();

        userHandler.setNext(limitHandler).setNext(expireHandler);

        return userHandler.process(user, coupon);
    };
}
