import { Types } from "mongoose";
import { AddressModel } from "../models/address.models";
import { UserModel } from "../models/users.model";
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";

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

    if (!Types.ObjectId.isValid(uid)) throw new Error("Invalid user ID!");

    const addressData = await AddressModel.find({
      uid,
    })
      .limit(limit)
      .skip(skip)
      .lean();

    if (!addressData.length) throw new Error("No Address found for this user!");

    res.send({
      data: addressData,
      error: null,
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

    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid Address ID!");

    const addressData = await AddressModel.findById(id).lean();

    if (!addressData) throw new Error("No Address found for this id!");

    res.send({
      data: addressData,
      error: null,
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

    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid Address ID!");

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

    res.send({
      data: addressData,
      error: null,
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
      throw new Error(
        "all required fields are not provided. name, phone, address1, address2, city, state, zipcode, uid"
      );
    }

    if (!Types.ObjectId.isValid(uid)) throw new Error("Invalid user ID!");

    const isUserExist = await UserModel.exists({ _id: uid });
    if (!isUserExist) throw new Error("User Doesn't Exist!");

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

    // console.log({ addressData });

    res.send({
      data: addressData,
      error: null,
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

    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid address!");

    const addressData = await AddressModel.deleteOne({ _id: id }).exec();

    if (addressData.deletedCount) {
      res.send({
        data: null,
        error: null,
        message: "Address Deleted Successfully!",
      });
      return;
    } else {
      throw new Error("Address not deleted!");
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
