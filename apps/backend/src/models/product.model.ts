import { Schema, model } from "mongoose";
import { IProduct } from "../types/product.types";

export const productSchema = new Schema<IProduct>(
  {
    sku: {
      type: String,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    price: {
      type: Number,
      required: true,
    },
    mrp: Number,
    images: [String],
    variants: [
      {
        color: String,
        url: String,
      },
    ],
    discount: Number,
  },
  { autoIndex: true }
);

export const ProductModel = model("Product", productSchema);
