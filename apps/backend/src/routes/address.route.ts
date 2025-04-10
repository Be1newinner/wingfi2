import { Router } from "express";
import {
  addAddressByUID,
  deleteAddressByID,
  getAllAddressByUID,
  getSingleAddressByID,
  updateAddressByID,
} from "@/controllers/address.controller";
import { VerifyAccessTokenMiddleWare } from "@/middlewares/VerifyAccessToken";
import { validateRequest } from "@/middlewares/validate.middleware";
import {
  createAddressSchema,
  getAddressByIdParamsSchema,
  getAddressByUidQuerySchema,
  updateAddressIDSchema,
  updateAddressSchema,
} from "@/validations/address.validation";

const AddressRouter = Router();

AddressRouter.get(
  "/all/:uid",
  VerifyAccessTokenMiddleWare,
  validateRequest({ query: getAddressByUidQuerySchema }),
  getAllAddressByUID
);

AddressRouter.get(
  "/:id",
  VerifyAccessTokenMiddleWare,
  validateRequest({ params: getAddressByIdParamsSchema }),
  getSingleAddressByID
);

AddressRouter.post(
  "/",
  VerifyAccessTokenMiddleWare,
  validateRequest({ body: createAddressSchema }),
  addAddressByUID
);

AddressRouter.patch(
  "/:id",
  VerifyAccessTokenMiddleWare,
  validateRequest({ params: updateAddressIDSchema, body: updateAddressSchema }),
  updateAddressByID
);

AddressRouter.delete(
  "/:id",
  VerifyAccessTokenMiddleWare,
  validateRequest({ params: updateAddressIDSchema }),
  deleteAddressByID
);

export { AddressRouter };
