import { Router } from "express";
import {
  getCartController,
  increaseItemQuanityInCartController,
} from "../controllers/carts.controller";

import { VerifyAccessTokenMiddleWare } from "../middlewares/VerifyAccessToken";

const CartRouter = Router();

/**
 * @swagger
 * /cart/{uid}:
 *   get:
 *     summary: Get cart for a user
 *     tags: [Cart]
 *     parameters:
 *       - name: uid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *                 message:
 *                   type: string
 *                 status_code:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 */
CartRouter.get("/:uid", VerifyAccessTokenMiddleWare, getCartController);

/**
 * @swagger
 * /cart:
 *   patch:
 *     summary: Increase or decrease item quantity in cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - action
 *             properties:
 *               product_id:
 *                 type: string
 *                 description: ID of the product
 *               action:
 *                 type: string
 *                 enum: [INCREASE, DECREASE]
 *                 description: Action to perform on quantity
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                 status_code:
 *                   type: number
 *       401:
 *         description: Unauthorized or missing fields
 *       404:
 *         description: Product or User not found
 */
CartRouter.patch(
  "/",
  VerifyAccessTokenMiddleWare,
  increaseItemQuanityInCartController
);

export { CartRouter };
