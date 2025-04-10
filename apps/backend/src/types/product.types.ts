import { Document, Schema } from "mongoose";

// src/interfaces/product.interface

export interface IProduct extends Document {
  sku: string;
  title: string;
  category: Schema.Types.ObjectId;
  description?: string;
  price: number;
  mrp?: number;
  images?: string[];
  variants?: {
    color: string;
    url: string;
  }[];
  discount?: number;
}
