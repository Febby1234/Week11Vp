import { Router } from "express";
import { customerRouter } from "./customer-route";
import { restaurantRouter } from "./restaurant-route";
import { orderRouter } from "./order-route";

export const publicRouter = Router();

publicRouter.use("/customers", customerRouter);
publicRouter.use("/restaurants", restaurantRouter);
publicRouter.use("/orders", orderRouter);