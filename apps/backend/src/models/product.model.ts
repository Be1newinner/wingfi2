import { Schema, model } from "mongoose";
import { IProduct } from "../interfaces/product.interfaces.ts";

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
    image: String,
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
