import type { CouponProcess } from "./CouponHandler.js";
import {
    ExpireHandler,
    LimitHandler,
    StatusHandler,
    UserHandler,
} from "./handlers/index.js";

export default class CouponValidator {
    handler: CouponProcess = (userId, coupon) => {
        const statusHandler = new StatusHandler();
        const userHandler = new UserHandler();
        const limitHandler = new LimitHandler();
        const expireHandler = new ExpireHandler();

        statusHandler
            .setNext(userHandler)
            .setNext(limitHandler)
            .setNext(expireHandler);

        return statusHandler.process(userId, coupon);
    };
}
