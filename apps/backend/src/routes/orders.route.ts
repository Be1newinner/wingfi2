import { Router } from "express";

import {
  generateOrder,
  getAllOrdersByUID,
  getOrderDetailsByID,
  updateOrderByID,
} from "../controllers/orders.controller.ts";

import { VerifyAccessTokenMiddleWare } from "../middlewares/VerifyAccessToken.ts";

const OrderRouter = Router();

OrderRouter.post("/", VerifyAccessTokenMiddleWare, generateOrder);

OrderRouter.get("/all", VerifyAccessTokenMiddleWare, getAllOrdersByUID);

OrderRouter.get(
  "/single/:id",
  VerifyAccessTokenMiddleWare,
  getOrderDetailsByID
);

OrderRouter.patch("/:id", VerifyAccessTokenMiddleWare, updateOrderByID);

export {
  OrderRouter,
};
