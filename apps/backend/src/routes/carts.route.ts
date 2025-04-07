import { Router } from "express";
import {
  getCartController,
  increaseItemQuanityInCartController,
} from "../controllers/carts.controller.ts";

import { VerifyAccessTokenMiddleWare } from "../middlewares/VerifyAccessToken.ts";

const CartRouter = Router();

CartRouter.get("/:uid", VerifyAccessTokenMiddleWare, getCartController);
CartRouter.patch(
  "/",
  VerifyAccessTokenMiddleWare,
  increaseItemQuanityInCartController
);

export { CartRouter };
