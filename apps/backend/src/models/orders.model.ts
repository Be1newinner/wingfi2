// src/models/order.model
import { Schema, model, Types } from "mongoose";
import { cartItemSchema, cartPricingSchema } from "./carts.model";
import { AddressBaseSchema } from "./address.models";
import { IOrder } from "../types/order.types";

const orderSchema = new Schema<IOrder>(
  {
    address: { type: AddressBaseSchema, required: true },
    items: {
      type: [cartItemSchema],
      required: true,
    },
    uid: { type: Types.ObjectId, ref: "users", required: true },
    shippingFee: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: [
        "Placed",
        "Confirmed",
        "Shipped",
        "OFD",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Placed",
    },
    orderTimeline: {
      placedAt: { type: Date, default: Date.now, required: true },
      confirmedAt: { type: Date },
      shippedAt: { type: Date },
      ofdAt: { type: Date },
      deliveredAt: { type: Date },
      cancelledAt: { type: Date },
      returnedAt: { type: Date },
    },
  },
  {
    autoIndex: true,
    timestamps: true,
  }
);

orderSchema.add(cartPricingSchema);

export const OrderModel = model<IOrder>("Order", orderSchema);
