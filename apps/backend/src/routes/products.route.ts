import { Router } from "express";

import {
  addListOfProductsController,
  addProductController,
  deleteProductByID,
  fetchProductController,
  fetchProductsListController,
  updateProductController,
} from "../controllers/products.controllers";

import { VerifyAccessTokenMiddleWare } from "../middlewares/VerifyAccessToken";
import { validateRequest } from "@/middlewares/validate.middleware";
import {
  addListOfProductsZodSchema,
  addProductZodSchema,
  deleteProductZodSchema,
  fetchProductsListZodSchema,
  fetchProductZodSchema,
  updateProductZodSchema,
} from "@/validations/product.validation";
import IsAdminMiddleware from "@/middlewares/isAdmin.middleware";

export const ProductRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get paginated list of products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of products
 */
ProductRouter.get(
  "/",
  validateRequest({ query: fetchProductsListZodSchema }),
  fetchProductsListController
);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sku:
 *                 type: string
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *             required:
 *               - sku
 *               - title
 *               - price
 *     responses:
 *       201:
 *         description: Product created
 */
ProductRouter.patch(
  "/",
  VerifyAccessTokenMiddleWare,
  IsAdminMiddleware,
  validateRequest({ body: updateProductZodSchema }),
  updateProductController
);

/**
 * @swagger
 * /products:
 *   patch:
 *     summary: Update a product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sku
 *             properties:
 *               sku:
 *                 type: string
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated
 */
ProductRouter.post(
  "/",
  VerifyAccessTokenMiddleWare,
  IsAdminMiddleware,
  validateRequest({ body: addProductZodSchema }),
  addProductController
);

ProductRouter.post(
  "/bulk",
  VerifyAccessTokenMiddleWare,
  IsAdminMiddleware,
  validateRequest({ body: addListOfProductsZodSchema }),
  addListOfProductsController
);

/**
 * @swagger
 * /products/{sku}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Product deleted
 */
ProductRouter.delete(
  "/:sku",
  VerifyAccessTokenMiddleWare,
  IsAdminMiddleware,
  validateRequest({ query: deleteProductZodSchema }),
  deleteProductByID
);

/**
 * @swagger
 * /products/{sku}:
 *   get:
 *     summary: Get a single product by SKU
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: sku
 *         required: true
 *         schema:
 *           type: string
 *         description: Product SKU
 *     responses:
 *       200:
 *         description: Product data
 *       404:
 *         description: Product not found
 */
ProductRouter.get(
  "/:sku",
  validateRequest({ query: fetchProductZodSchema }),
  fetchProductController
);
