import { model, Schema } from "mongoose";
import { hashing } from "../utils/hashing";
import { GENDER, ROLE, UserStored } from "../types/user.types";

const UserSchema = new Schema<UserStored>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    gender: { type: String, enum: Object.values(GENDER) },
    role: {
      type: String,
      enum: Object.values(ROLE),
      default: ROLE.CLIENT,
    },
    password: {
      type: String,
      minlength: 6,
      maxlength: 12,
    },
  },
  {
    autoIndex: true,
  }
);

UserSchema.pre("save", async function (next) {
  // console.log({ user });
  const user = this as UserStored;

  if (!user.isModified("password")) return next();

  user.password = await hashing(user.password);
  next();
});

export const UserModel = model("User", UserSchema);
