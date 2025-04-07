// src/models/address.model.ts
import { Schema, model, Document, Types } from "mongoose";
import { IAddress, IAddressBase } from "../types/address.types";

export const AddressBaseSchema = new Schema<IAddressBase>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address1: { type: String, required: true },
    address2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipcode: { type: String, required: true },
  },
  {
    _id: false,
  }
);

const AddressSchema = new Schema<IAddress & Document>(
  {
    uid: {
      type: Types.ObjectId,
      required: true,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

AddressSchema.add(AddressBaseSchema);

export const AddressModel = model<IAddress>("Address", AddressSchema);
