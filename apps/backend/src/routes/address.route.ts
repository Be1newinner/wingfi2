import { Router } from "express";
import {
  addAddressByUID,
  deleteAddressByID,
  getAllAddressByUID,
  getSingleAddressByID,
  updateAddressByID,
} from "../controllers/address.controller.ts";

const AddressRouter = Router();

AddressRouter.get("/all/:uid", getAllAddressByUID);
AddressRouter.get("/:id", getSingleAddressByID);
AddressRouter.delete("/:id", deleteAddressByID);
AddressRouter.patch("/:id", updateAddressByID);
AddressRouter.post("/", addAddressByUID);

export { AddressRouter };
