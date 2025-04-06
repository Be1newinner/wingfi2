import { Router } from "express";
import {
  AddNewProductController,
  ProductsListController,
} from "../controllers/products.controllers.ts";

const productRouter = Router();

productRouter
  .route("/")
  .get(ProductsListController)
  .post(AddNewProductController);

// productRouter.route("/").get(GetListOfProducts);
// productRouter.route("/").post(AddSingleProductController);
// productRouter.route("/").patch(UpdateSingleProductController);
// productRouter.route("/bulk").post(AddListOfProductsController);
// productRouter.route("/:sku").get(GetSingleProduct);
// productRouter.route("/:sku").delete(deleteProductByID);

export default productRouter;
