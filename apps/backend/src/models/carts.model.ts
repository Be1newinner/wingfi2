// src/models/cart.model.ts
import { model, Schema, Types } from "mongoose";
import { productSchema } from "./product.model.ts";
import {
  ICart,
  ICartItem,
  ICartPricing,
} from "../interfaces/cart.interfaces.ts";

export const cartPricingSchema = new Schema<ICartPricing>(
  {
    subtotal: { type: Number, required: true, min: 0, default: 0 },
    tax: { type: Number, required: true, min: 0, default: 0 },
    discount: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false }
);

export const cartItemSchema = new Schema<ICartItem>(
  {
    _id: {
      type: Types.ObjectId,
      ref: "products",
      required: true,
    },
    qty: { type: Number, required: true, min: 0, default: 0 },
    subtotal: { type: Number, required: true, min: 0, default: 0 },
  },
  {
    autoIndex: true,
    _id: false,
  }
);

cartItemSchema.add(productSchema);

export const cartSchema = new Schema<ICart>(
  {
    _id: {
      type: Types.ObjectId,
      ref: "users",
      required: true,
    },
    items: { type: [cartItemSchema], required: true },
    total: { type: Number, required: true, min: 0, default: 0 },
    subtotal: { type: Number, required: true, min: 0, default: 0 },
    tax: { type: Number, required: true, min: 0, default: 0 },
    discount: { type: Number, required: true, min: 0, default: 0 },
  },
  {
    autoIndex: true,
    timestamps: true,
  }
);

export const CartModel = model<ICart>("Cart", cartSchema);
