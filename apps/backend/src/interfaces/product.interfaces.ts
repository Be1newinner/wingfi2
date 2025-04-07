import { Document } from "mongoose";

// src/interfaces/product.interface.ts
export interface IProduct extends Document {
  sku: string;
  title: string;
  description?: string;
  price: number;
  mrp?: number;
  image?: string;
  images?: string[];
  variants?: {
    color: string;
    url: string;
  }[];
  discount?: number;
}