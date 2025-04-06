import { model, Schema } from "mongoose";

export const productSchema = new Schema(
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
  },
  { autoIndex: true }
);

export const ProductModel = model("Product", productSchema);
