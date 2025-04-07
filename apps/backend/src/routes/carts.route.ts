import { Router } from "express";
import {
  getCartController,
  increaseItemQuanityInCartController,
} from "../controllers/carts.controller";

import { VerifyAccessTokenMiddleWare } from "../middlewares/VerifyAccessToken";

const CartRouter = Router();

CartRouter.get("/:uid", VerifyAccessTokenMiddleWare, getCartController);
CartRouter.patch(
  "/",
  VerifyAccessTokenMiddleWare,
  increaseItemQuanityInCartController
);

export { CartRouter };
