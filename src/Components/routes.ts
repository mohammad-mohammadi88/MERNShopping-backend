import commentRouter from "@Comment/comment.route.js";
import couponRouter from "@Coupon/coupon.route.js";
import { auth, authAdmin } from "@Middlewares";
import orderRouter from "@Order/order.route.js";
import productCategoryRouter from "@P_Category/productCategory.route.js";
import paymentRouter from "@Payment/payment.route.js";
import productRouter from "@Product/product.route.js";
import shipmentRouter from "@Shipment/shipment.route.js";
import userRouter from "@User/user.route.js";

import express from "express";

const appRouter = express.Router();

// global routes
appRouter.use("/categories", productCategoryRouter);
appRouter.use("/products", productRouter);
appRouter.use("/users", userRouter);

// user routes
appRouter.use(auth);
appRouter.use("/orders", orderRouter);
appRouter.use("/payments", paymentRouter);
appRouter.use("/comments", commentRouter);
appRouter.use("/shipments", shipmentRouter);

// admin routes
appRouter.use(authAdmin);
appRouter.use("/coupons", couponRouter);

export default appRouter;
