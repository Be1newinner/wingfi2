import { Request, Response } from "express";
import { UserModel, UserStored } from "../models/users.model.ts";
import { verifyHash } from "../utils/hashing.ts";
import { decodeToken, generateLoginTokens } from "../utils/tokens.ts";

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).lean();

    if (!user) {
      res.status(404).json({
        error: "No User Found!",
        message: "User Logged In Failed!",
        data: null,
      });
      return;
    }

    // console.log(user);

    const isPasswordValid = await verifyHash(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        error: "Invalid credentials",
        message: "Invalid email or password!",
        data: null,
      });
      return;
    }

    // ✅ Await the token generation (Fixes Promise issue)
    const tokens = await generateLoginTokens({
      email: user.email,
      role: user.role,
      _id: user._id as string,
    });

    const updateResult = await UserModel.updateOne(
      { email },
      {
        $set: {
          refreshToken: tokens.refreshToken,
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      res.status(404).json({
        error: "User not found",
        message: "Failed to update refresh token",
        data: null,
      });
      return;
    }

    if (updateResult.modifiedCount === 0) {
      console.warn("⚠️ Refresh token update skipped (token might be the same)");
    }
    // ✅ Remove sensitive data before sending response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    res
      .status(200)
      .cookie("refreshToken", tokens.refreshToken, {
        // httpOnly: true,
        secure: process.env.NODE_ENV === "production", // ✅ Only secure in production
        // sameSite: "strict",
        // path: "/",
      })
      .json({
        error: null,
        message: "User logged in successfully!",
        data: {
          ...userWithoutPassword,
          accessToken: tokens.accessToken,
        },
      });
    return;
  } catch (error) {
    const errorMessage = (error as Error).message || "Unexpected error!";

    res.status(500).json({
      error: error,
      message: errorMessage,
      data: null,
    });
  }
}

export async function registerController(req: Request, res: Response) {
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

    if (user) {
      res.status(200).json({
        error: null,
        message: "User Logged In Success!",
        data: user,
      });
    } else {
      res.status(404).json({
        error: "No User Found!",
        message: "User Logged In Failed!",
        data: null,
      });
    }
  } catch (error) {
    const errorMessage = (error as Error).message || "Unexpected error!";

    res.status(500).json({
      error: error,
      message: errorMessage,
      data: null,
    });
  }
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log({ refreshToken });

    if (!refreshToken)
      return void res
        .status(401)
        .json({ error: "Unauthorized", message: "Missing refresh token" });

    const decodedToken = await decodeToken(refreshToken);

    console.log({ decodedToken });

    const user = await UserModel.findOne({ email: decodedToken.email }).lean();

    console.log({ user }, user?.refreshToken === refreshToken);

    if (!user || user.refreshToken !== refreshToken) {
      res
        .status(403)
        .json({ error: "Invalid refresh token", message: "Token revoked" });
      return;
    }

    const tokens = await generateLoginTokens({
      email: user.email,
      _id: user._id.toString(),
      role: user.role,
    });

    const updateResult = await UserModel.updateOne(
      { email: user.email },
      { $set: { refreshToken: tokens.refreshToken } }
    );

    if (!updateResult.matchedCount) {
      res
        .status(404)
        .json({ error: "User not found", message: "Failed to update token" });
      return;
    }

    res
      .status(200)
      .cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/api/auth/refresh-token",
      })
      .json({
        error: null,
        message: "Token refreshed successfully",
        data: { accessToken: tokens.accessToken },
      });
  } catch (error) {
    res.status(401).json({
      error: (error as Error).message,
      message: "Refresh token verification failed",
    });
  }
}
