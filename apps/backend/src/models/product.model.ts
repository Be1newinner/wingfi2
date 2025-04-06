// Step 1. build a Product schema ( object means structure )
// https://mongoosejs.com/docs/guide.html

import { model, Schema } from "mongoose";

// Step 2. build a Product Model ( for transaction pupose )
// https://mongoosejs.com/docs/models.html

// Data types of schema
// String
// Number
// Date
// Buffer
// Boolean
// Mixed
// ObjectId
// Array
// Decimal128
// Map
// Schema
// UUID
// BigInt
// Double
// Int32

const productSchema = new Schema(
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
