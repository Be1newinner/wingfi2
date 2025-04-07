// src/interfaces/order.interface
import { Document, ObjectId } from "mongoose";
import { ICartItem, ICartPricing } from "./cart.types";
import { IAddressBase } from "./address.types";

export type OrderStatus =
  | "Placed"
  | "Confirmed"
  | "Shipped"
  | "OFD"
  | "Delivered"
  | "Cancelled"
  | "Returned";

export interface IOrderTimeline {
  placedAt: Date;
  confirmedAt?: Date;
  shippedAt?: Date;
  ofdAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  returnedAt?: Date;
}

export interface IOrder extends Document, ICartPricing {
  address: IAddressBase;
  items: ICartItem[];
  uid: ObjectId;
  shippingFee: number;
  status: OrderStatus;
  orderTimeline: IOrderTimeline;
  createdAt?: Date;
  updatedAt?: Date;
}
