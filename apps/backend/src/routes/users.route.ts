import { Router } from "express";
import {
  loginController,
  refreshToken,
  registerController,
  resetPassword,
} from "../controllers/users.controller";
import { validate_dto_middleWare } from "@/middlewares/validate.middleware";
import { LoginDTO } from "@/dto/auth/login.dto";
import { RegisterDTO } from "@/dto/auth/register.dto";

export const AuthRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API endpoints for user authentication
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *       example:
 *         email: "user@example.com"
 *         password: "securepassword"
 *
 *     UserRegister:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - gender
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER]
 *           description: Gender of the user
 *         phone:
 *           type: string
 *           description: User's phone number
 *       example:
 *         name: "John Doe"
 *         email: "john@example.com"
 *         password: "securepassword"
 *         gender: "MALE"
 *         phone: "9876543210"
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   nullable: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: No user found
 */
AuthRouter.post("/login", validate_dto_middleWare(LoginDTO), loginController);

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: User registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       200:
 *         description: Successful registration
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Email already exists
 */
AuthRouter.post(
  "/register",
  validate_dto_middleWare(RegisterDTO),
  registerController
);

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: Refresh Access Token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Missing refresh token
 *       403:
 *         description: Invalid refresh token
 *       404:
 *         description: Failed to update token
 */
AuthRouter.post("/refresh-token", refreshToken);

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Reset User Password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Missing refresh token
 *       403:
 *         description: Invalid refresh token
 *       404:
 *         description: Failed to update token
 */
AuthRouter.post("/reset-password", resetPassword);
