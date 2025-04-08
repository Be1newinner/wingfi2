import { Router } from "express";
import {
  addAddressByUID,
  deleteAddressByID,
  getAllAddressByUID,
  getSingleAddressByID,
  updateAddressByID,
} from "../controllers/address.controller";

const AddressRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Address
 *   description: User address management
 */

/**
 * @swagger
 * /address/all/{uid}:
 *   get:
 *     summary: Get all addresses of a user
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of addresses
 */
AddressRouter.get("/all/:uid", getAllAddressByUID);

/**
 * @swagger
 * /address/{id}:
 *   get:
 *     summary: Get a single address by ID
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address object
 */
AddressRouter.get("/:id", getSingleAddressByID);

/**
 * @swagger
 * /address/{id}:
 *   delete:
 *     summary: Delete an address by ID
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Address ID
 *     responses:
 *       200:
 *         description: Address deleted
 */
AddressRouter.delete("/:id", deleteAddressByID);

/**
 * @swagger
 * /address/{id}:
 *   patch:
 *     summary: Update an address by ID
 *     tags: [Address]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Address ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressInput'
 *     responses:
 *       200:
 *         description: Address updated
 */
AddressRouter.patch("/:id", updateAddressByID);

/**
 * @swagger
 * /address:
 *   post:
 *     summary: Add a new address for a user
 *     tags: [Address]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressInput'
 *     responses:
 *       201:
 *         description: Address created
 */
AddressRouter.post("/", addAddressByUID);

export { AddressRouter };
