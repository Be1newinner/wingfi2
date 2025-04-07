import { NextFunction, Request, Response } from "express";
import { AddressModel } from "../models/address.models";
import { CartModel } from "../models/carts.model";
import { OrderModel } from "../models/orders.model";
import AppError from "../utils/AppError";
import { SendResponse } from "@/utils/JsonResponse";

const getOrderDetailsByID = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    console.error(error);

    const errMessage =
      error instanceof AppError
        ? error.message
        : "Unable to retrieve Order Detail";

    const errCode = error instanceof AppError ? error.statusCode : 500;

    return next(new AppError(errMessage, errCode));
  }
};

const getAllOrdersByUID = (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    console.error(error);

    const errMessage =
      error instanceof AppError ? error.message : "Unable to retrieve orders";

    const errCode = error instanceof AppError ? error.statusCode : 500;

    return next(new AppError(errMessage, errCode));
  }
};

const updateOrderByID = (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    console.error(error);

    const errMessage =
      error instanceof AppError
        ? error.message
        : "Unable to update order detail!";

    const errCode = error instanceof AppError ? error.statusCode : 500;

    return next(new AppError(errMessage, errCode));
  }
};

const generateOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { address, shippingFee } = req.body;

    const uid = req.user?.uid;

    const cartData = await CartModel.findById(uid)
      .select({
        discount: true,
        total: true,
        subtotal: true,
        items: true,
        tax: true,
        _id: false,
      })
      .lean();

    if (!cartData) next(new AppError("Cart Doesn't Exist for this User!", 404));

    // console.log({ cartData });

    const addressData = await AddressModel.findOne({ _id: address, uid })
      .select({
        name: true,
        phone: true,
        address1: true,
        address2: true,
        city: true,
        state: true,
        zipcode: true,
        _id: false,
      })
      .lean();

    if (!addressData)
      throw new Error("This Address Doesn't Exist for this User!");

    const orderResponse = await OrderModel.insertOne({
      address: {
        name: addressData.name,
        phone: addressData.phone,
        address1: addressData.address1,
        address2: addressData.address2,
        city: addressData.city,
        state: addressData.state,
        zipcode: addressData.zipcode,
      },
      items: cartData?.items,
      uid,
      shippingFee,
      subtotal: cartData?.subtotal,
      tax: cartData?.tax,
      discount: cartData?.discount,
    });

    await CartModel.deleteOne({ _id: uid });

    SendResponse(res, {
      data: orderResponse,
      message: "Generate Order success!",
      status_code: 201,
    });
  } catch (error) {
    console.error(error);

    const errMessage =
      error instanceof AppError ? error.message : "Unable to generate Order!";

    const errCode = error instanceof AppError ? error.statusCode : 500;

    return next(new AppError(errMessage, errCode));
  }
};

export {
  getOrderDetailsByID,
  getAllOrdersByUID,
  updateOrderByID,
  generateOrder,
};
