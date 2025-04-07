import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/users.model";
import { verifyHash } from "../utils/hashing";
import { decodeToken, generateLoginTokens } from "../utils/tokens";
import AppError from "../utils/AppError";
import { SendResponse } from "../utils/JsonResponse";
import { UserStored } from "../types/user.types";

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).lean();

    if (!user) return next(new AppError("User Logged In Failed!", 404));

    const isPasswordValid = await verifyHash(password, user.password);

    if (!isPasswordValid)
      return next(new AppError("Invalid email or password!", 404));

    const tokens = await generateLoginTokens({
      email: user.email,
      role: user.role,
      uid: user._id as string,
    });

    const updateResult = await UserModel.updateOne(
      { email },
      {
        $set: {
          refreshToken: tokens.refreshToken,
        },
      }
    );

    if (updateResult.matchedCount === 0)
      return next(
        new AppError("Failed to update refresh token! User not found!", 404)
      );

    if (updateResult.modifiedCount === 0) {
      console.warn("Refresh token update skipped (token might be the same)");
    }

    const userWithoutPassword = (({ password: _password, ...rest }) => rest)(
      user
    );

    SendResponse(
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      }),
      {
        status_code: 200,
        message: "User logged in successfully!",
        data: {
          ...userWithoutPassword,
          accessToken: tokens.accessToken,
        },
      }
    );
  } catch (error) {
    const errorMessage = (error as Error).message || "Login failed!";
    return next(new AppError(errorMessage, 500));
  }
}

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password, name, gender, role, phone } = <UserStored>req.body;

    const userData = new UserModel({
      email,
      password,
      name,
      gender,
      role,
      phone,
    });

    const user = await userData.save();

    if (!user)
      return next(new AppError("User Logged In Failed. No User Found!", 404));

    SendResponse(res, {
      message: "User Logged In Success!",
      data: user,
      status_code: 200,
    });
  } catch (error) {
    const errorMessage =
      (error as Error).message || "User Registration Failed!";

    next(new AppError(errorMessage, 500));
  }
}

export async function refreshToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const refreshToken = req.cookies["refreshToken"];
    // console.log({ refreshToken });

    if (!refreshToken)
      return next(new AppError("Unauthorized. Missing Refresh Token", 401));

    const decodedToken = await decodeToken(refreshToken);

    // console.log({ decodedToken });

    const user = await UserModel.findOne({ email: decodedToken.email }).lean();

    // console.log({ user }, user?.refreshToken === refreshToken);

    if (!user || user.refreshToken !== refreshToken)
      return next(new AppError("Unauthorized. Invalid refresh token", 403));

    const tokens = await generateLoginTokens({
      email: user.email,
      uid: user._id.toString(),
      role: user.role,
    });

    const updateResult = await UserModel.updateOne(
      { email: user.email },
      { $set: { refreshToken: tokens.refreshToken } }
    );

    if (!updateResult.matchedCount)
      return next(new AppError("Failed to update token. User not found!", 404));

    SendResponse(
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/api/auth/refresh-token",
      }),
      {
        message: "Token refreshed successfully",
        data: { accessToken: tokens.accessToken },
        status_code: 200,
      }
    );
  } catch (error) {
    // console.error(error);

    const errorMessage =
      (error as Error).message || "Refresh Token Generation Failed!";

    next(new AppError(errorMessage, 401));
  }
}
