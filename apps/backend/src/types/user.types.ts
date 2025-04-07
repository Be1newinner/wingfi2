// src/interfaces/user.interface
import { Document } from "mongoose";

export enum GENDER {
  "MALE" = "MALE",
  "FEMALE" = "FEMALE",
  "OTHER" = "OTHER",
}

export enum ROLE {
  CLIENT = "CLIENT",
  VENDOR = "VENDOR",
  ADMIN = "ADMIN",
}

export interface UserBase {
  name: string;
  email: string;
  phone: number;
  gender: GENDER;
  role: ROLE;
}

export interface UserStored extends Document, UserBase {
  password: string;
  refreshToken: string;
}