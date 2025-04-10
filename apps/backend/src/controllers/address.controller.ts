import { Request, Response, NextFunction } from "express";
import * as AddressService from "@/services/address.service";
import { SendResponse } from "@/utils/JsonResponse";

export const getAllAddressByUID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = Math.max(Math.min(Number(req.query.limit) || 6, 10), 1);
    const page = Math.max(Number(req.query.page) || 1, 1);

    const data = await AddressService.getAllAddresses(
      req.user?.uid || "",
      page,
      limit
    );
    SendResponse(res, { data, message: "Addresses fetched", status_code: 200 });
  } catch (err) {
    next(err);
  }
};

export const getSingleAddressByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await AddressService.getAddressById(req.params.id);
    if (!data) throw new Error("Address not found");
    SendResponse(res, { data, message: "Address fetched", status_code: 200 });
  } catch (err) {
    next(err);
  }
};

export const addAddressByUID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await AddressService.addAddress(req.body);
    SendResponse(res, { data, message: "Address added", status_code: 201 });
  } catch (err) {
    next(err);
  }
};

export const updateAddressByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await AddressService.updateAddress(req.params.id, req.body);
    if (!data) throw new Error("Address not found");
    SendResponse(res, { data, message: "Address updated", status_code: 200 });
  } catch (err) {
    next(err);
  }
};

export const deleteAddressByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AddressService.deleteAddress(req.params.id);
    if (!result.deletedCount) throw new Error("Address not deleted");
    SendResponse(res, { message: "Address deleted", status_code: 200 });
  } catch (err) {
    next(err);
  }
};
