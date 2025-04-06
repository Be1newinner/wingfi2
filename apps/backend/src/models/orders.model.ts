import { Schema, model, Types } from "mongoose";
import { cartItemSchema, CartPricingSchema } from "./carts.model.js";
import { AddressBaseSchema } from "./address.models.js";

// PricingSchema
const OrderSchema = new Schema(
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

    // ORDER PROGRESS TIMESTAMPS
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

OrderSchema.add(CartPricingSchema);

const OrderModel = model("Order", OrderSchema);

export { OrderModel };
