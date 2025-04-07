import { ObjectId } from "mongoose";

export interface IAddressBase {
  name: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface IAddress extends IAddressBase {
  uid: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
