import couponRouter from "@Coupon/coupon.route.js";
import orderRouter from "@Order/order.route.js";
import productCategoryRouter from "@P_Category/productCategory.route.js";
import productOffersRouter from "@P_Offer/productOffer.route.js";
import paymentRouter from "@Payment/payment.route.js";
import productRouter from "@Product/product.route.js";
import userRouter from "@User/user.route.js";

import express from "express";

const appRouter = express.Router();

appRouter.use("/categories", productCategoryRouter);
appRouter.use("/coupon", couponRouter);
appRouter.use("/offers", productOffersRouter);
appRouter.use("/orders", orderRouter);
appRouter.use("/products", productRouter);
appRouter.use("/users", userRouter);
appRouter.use("/payment", paymentRouter);

export default appRouter;
