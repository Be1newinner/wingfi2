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
import { validate_dto_middleWare } from "@/middlewares/validateDTO.middleware";
import { GetProductsQueryDTO } from "@/dto/products/fetchProductsList.dto";

export const ProductRouter = Router();

ProductRouter.get(
  "/",
  validate_dto_middleWare(GetProductsQueryDTO, "query"),
  fetchProductsListController
);

ProductRouter.use(VerifyAccessTokenMiddleWare)
  .route("/")
  .post(addProductController)
  .patch(updateSingleProductController);

ProductRouter.use(VerifyAccessTokenMiddleWare)
  .route("/bulk")
  .post(addListOfProductsController);

ProductRouter.use(VerifyAccessTokenMiddleWare)
  .route("/:sku")
  .delete(deleteProductByID);

ProductRouter.route("/:sku").get(fetchProductController);
