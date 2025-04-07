import { Types } from "mongoose";
import { AddressModel } from "../models/address.models";
import { UserModel } from "../models/users.model";
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { SendResponse } from "@/utils/JsonResponse";

async function getAllAddressByUID(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { uid } = req.params;
    const limit = Math.max(Math.min(Number(req.query.limit) || 6, 8), 1);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    if (!Types.ObjectId.isValid(uid)) {
      next(new AppError("Invalid user ID!", 401));
      return;
    }

    const addressData = await AddressModel.find({
      uid,
    })
      .limit(limit)
      .skip(skip)
      .lean();

    if (!addressData.length) {
      next(new AppError("No Address found for this user!", 401));
      return;
    }

    SendResponse(res, {
      data: addressData,
      status_code: 200,
      message: "Addresses fetched successfully!",
    });
  } catch (error) {
    console.error(error);

    const errMessage =
      error instanceof AppError ? error.message : "Address fetching failed!";

    const errCode = error instanceof AppError ? error.statusCode : 500;

    next(new AppError(errMessage, errCode));
  }
}

async function getSingleAddressByID(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      next(new AppError("Invalid Address ID!", 401));
      return;
    }

    const addressData = await AddressModel.findById(id).lean();

    if (!addressData) {
      next(new AppError("No Address found for this id!", 401));
      return;
    }

    SendResponse(res, {
      data: addressData,
      status_code: 200,
      message: "Address fetched successfully!",
    });
  } catch (error) {
    console.error(error);

    const errMessage =
      error instanceof AppError ? error.message : "Address fetching failed!";

    const errCode = error instanceof AppError ? error.statusCode : 500;

    next(new AppError(errMessage, errCode));
  }
}

async function updateAddressByID(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { name, phone, address1, address2, city, state, zipcode } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      next(new AppError("Invalid Address ID!", 401));
      return;
    }

    const addressData = await AddressModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          phone,
          address1,
          address2,
          city,
          state,
          zipcode,
        },
      },
      { new: true }
    ).lean();

    if (!addressData) {
      res.status(404).json({ error: "Address not found!" });
      return;
    }

    SendResponse(res, {
      data: addressData,
      status_code: 200,
      message: "Address updated successfully!",
    });
  } catch (error) {
    console.error(error);

    const errMessage =
      error instanceof AppError ? error.message : "Address updating failed!";

    const errCode = error instanceof AppError ? error.statusCode : 500;

    next(new AppError(errMessage, errCode));
  }
}

async function addAddressByUID(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, phone, address1, address2, city, state, zipcode, uid } =
      req.body;

    if (
      !name ||
      !phone ||
      !address1 ||
      !address2 ||
      !city ||
      !state ||
      !zipcode ||
      !uid
    ) {
      next(
        new AppError(
          "all required fields are not provided. name, phone, address1, address2, city, state, zipcode, uid",
          401
        )
      );
      return;
    }

    if (!Types.ObjectId.isValid(uid)) {
      next(new AppError("Invalid user ID!", 401));
      return;
    }

    const isUserExist = await UserModel.exists({ _id: uid });
    if (!isUserExist) {
      next(new AppError("User Doesn't Exist!", 404));
      return;
    }

    const addressData = await AddressModel.insertOne({
      name,
      phone,
      address1,
      address2,
      city,
      state,
      zipcode,
      uid,
    });

    SendResponse(res, {
      data: addressData,
      status_code: 201,
      message: "Address added successfully!",
    });
  } catch (error) {
    console.error(error);

    const errMessage =
      error instanceof AppError ? error.message : "Address adding failed!";

    const errCode = error instanceof AppError ? error.statusCode : 500;

    next(new AppError(errMessage, errCode));
  }
}

async function deleteAddressByID(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      next(new AppError("Invalid address!", 404));
      return;
    }

    const addressData = await AddressModel.deleteOne({ _id: id }).exec();

    if (addressData.deletedCount) {
      SendResponse(res, {
        status_code: 200,
        message: "Address deleted successfully!",
      });
    } else {
      next(new AppError("Address deletion failed!", 500));
    }
  } catch (error) {
    console.error(error);

    const errMessage =
      error instanceof AppError ? error.message : "Address deleting failed!";

    const errCode = error instanceof AppError ? error.statusCode : 500;

    next(new AppError(errMessage, errCode));
  }
}

export {
  getAllAddressByUID,
  getSingleAddressByID,
  updateAddressByID,
  addAddressByUID,
  deleteAddressByID,
};
