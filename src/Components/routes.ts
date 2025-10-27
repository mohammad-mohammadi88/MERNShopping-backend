import couponRouter from "@Coupon/coupon.route.js";
import { authAdmin } from "@Middlewares";
import orderRouter from "@Order/order.route.js";
import productCategoryRouter from "@P_Category/productCategory.route.js";
import productOffersRouter from "@P_Offer/productOffer.route.js";
import paymentRouter from "@Payment/payment.route.js";
import productRouter from "@Product/product.route.js";
import shipmentRouter from "@Shipment/shipment.route.js";
import userRouter from "@User/user.route.js";

import express from "express";

const appRouter = express.Router();

appRouter.use("/categories", productCategoryRouter);
appRouter.use("/offers", productOffersRouter);
appRouter.use("/orders", orderRouter);
appRouter.use("/products", productRouter);
appRouter.use("/users", userRouter);
appRouter.use("/payments", paymentRouter);

appRouter.use(authAdmin);
appRouter.use("/coupons", couponRouter);
appRouter.use("/shipments", shipmentRouter);

export default appRouter;
