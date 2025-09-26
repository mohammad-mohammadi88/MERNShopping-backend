import type ICoupon from "@Coupon/schema/coupon.d.js";
import { ExpireHandler, LimitHandler, UserHandler } from "./handlers/index.js";

export default class CouponValidator {
    handler = (userId: string, coupon: ICoupon) => {
        const userHandler = new UserHandler();
        const limitHandler = new LimitHandler();
        const expireHandler = new ExpireHandler();

        userHandler.setNext(limitHandler).setNext(expireHandler);
        console.log("🚀 ~ CouponValidator ~ userHandler:", userHandler);

        return userHandler.process(userId, coupon);
    };
}
