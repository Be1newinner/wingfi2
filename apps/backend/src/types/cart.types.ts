// src/interfaces/cart.interface
import { Document, ObjectId } from "mongoose";
import { IProduct } from "./product.types";

export interface ICartPricing {
  subtotal: number;
  tax: number;
  discount: number;
}

export interface ICartItem extends Document, IProduct {
  _id: ObjectId;
  qty: number;
  subtotal: number;
}

export interface ICart extends Document, ICartPricing {
  _id: ObjectId;
  items: ICartItem[];
  total: number;
}
