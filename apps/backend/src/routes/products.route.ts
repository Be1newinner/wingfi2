import { Router } from "express";

import {
  addListOfProductsController,
  addProductController,
  deleteProductByID,
  fetchProductController,
  fetchProductsListController,
  updateSingleProductController,
} from "../controllers/products.controllers";

import { VerifyAccessTokenMiddleWare } from "../middlewares/VerifyAccessToken";

export const ProductRouter = Router();

ProductRouter.route("/").get(fetchProductsListController);

ProductRouter
  .use(VerifyAccessTokenMiddleWare)
  .route("/")
  .post(addProductController)
  .patch(updateSingleProductController);

ProductRouter
  .use(VerifyAccessTokenMiddleWare)
  .route("/bulk")
  .post(addListOfProductsController);

ProductRouter
  .use(VerifyAccessTokenMiddleWare)
  .route("/:sku")
  .delete(deleteProductByID);

ProductRouter.route("/:sku").get(fetchProductController);

