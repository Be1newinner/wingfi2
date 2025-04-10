import { UserModel } from "@/models/users.model";
import { Types } from "mongoose";
import AppError from "@/utils/AppError";
import { AddressModel } from "@/models/address.models";

export const getAllAddresses = async (
  uid: string,
  page: number,
  limit: number
) => {
  if (!Types.ObjectId.isValid(uid)) throw new AppError("Invalid User ID", 400);
  return await AddressModel.find({ uid })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
};

export const getAddressById = async (id: string) => {
  if (!Types.ObjectId.isValid(id))
    throw new AppError("Invalid Address ID", 400);
  return await AddressModel.findById(id).lean();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addAddress = async (payload: any) => {
  if (!Types.ObjectId.isValid(payload.uid))
    throw new AppError("Invalid User ID", 400);
  const user = await UserModel.exists({ _id: payload.uid });
  if (!user) throw new AppError("User does not exist", 404);
  return await AddressModel.create(payload);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateAddress = async (id: string, payload: any) => {
  if (!Types.ObjectId.isValid(id))
    throw new AppError("Invalid Address ID", 400);
  return await AddressModel.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true }
  ).lean();
};

export const deleteAddress = async (id: string) => {
  if (!Types.ObjectId.isValid(id))
    throw new AppError("Invalid Address ID", 400);
  return await AddressModel.deleteOne({ _id: id });
};
