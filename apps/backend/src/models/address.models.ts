import { Schema, model } from "mongoose";

// Indian Based Addresses
export const AddressBaseSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address1: { type: String, required: true },
  address2: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: String, required: true },
});

const AddressSchema = new Schema(
  {
    uid: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

AddressSchema.add(AddressBaseSchema);

export const AddressModel = model("Address", AddressSchema);
