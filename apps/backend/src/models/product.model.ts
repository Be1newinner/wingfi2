import { Schema, Types, model } from "mongoose";
import { IProduct } from "../types/product.types";

export const productSchema = new Schema<IProduct>(
  {
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    category: {
      type: Types.ObjectId,
      ref: "categories",
      required: [true, "Category is required"],
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    mrp: {
      type: Number,
      min: [0, "MRP cannot be negative"],
    },
    images: {
      type: [String],
      default: [],
    },
    variants: [
      {
        color: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    discount: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount can't exceed 100%"],
    },
  },
  {
    timestamps: true,
    autoIndex: true,
  }
);

productSchema.index({ sku: 1 }, { unique: true });
productSchema.index({ "variants.color": 1 });

export const ProductModel = model("Product", productSchema);
