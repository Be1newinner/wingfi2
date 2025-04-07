import { Router } from "express";

import {
  generateOrder,
  getAllOrdersByUID,
  getOrderDetailsByID,
  updateOrderByID,
} from "../controllers/orders.controller";

import { VerifyAccessTokenMiddleWare } from "../middlewares/VerifyAccessToken";

const OrderRouter = Router();

OrderRouter.post("/", VerifyAccessTokenMiddleWare, generateOrder);

OrderRouter.get("/all", VerifyAccessTokenMiddleWare, getAllOrdersByUID);

OrderRouter.get(
  "/single/:id",
  VerifyAccessTokenMiddleWare,
  getOrderDetailsByID
);

OrderRouter.patch("/:id", VerifyAccessTokenMiddleWare, updateOrderByID);

export { OrderRouter };
