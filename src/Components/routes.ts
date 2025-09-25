import couponRouter from "@Coupon/coupon.route.js";
import ordersRouter from "@Orders/orders.route.js";
import productCategoryRouter from "@P_Category/productCategory.route.js";
import productOffersRouter from "@P_Offers/productOffers.route.js";
import paymentRouter from "@Payment/payment.route.js";
import productsRouter from "@Products/products.route.js";
import usersRouter from "@Users/users.route.js";

import express from "express";

const appRouter = express.Router();

appRouter.use("/categories", productCategoryRouter);
appRouter.use("/coupon", couponRouter);
appRouter.use("/offers", productOffersRouter);
appRouter.use("/orders", ordersRouter);
appRouter.use("/products", productsRouter);
appRouter.use("/users", usersRouter);
appRouter.use("/payment", paymentRouter);

export default appRouter;
