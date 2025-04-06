import { NextFunction, Request, Response } from "express";
import { decodeToken } from "../utils/tokens.ts";
import AppError from "../utils/AppError.ts";

export async function VerifyAccessTokenMiddleWare(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let token = req.headers["authorization"];

    if (!token) return next(new AppError("ACCESS TOKEN NOT FOUND!", 401));

    token = token.replace("Bearer ", "");

    const data = await decodeToken(token);

    req.user = data;
    next();
  } catch (error: unknown) {
    console.error("Token verification failed:", error);
    next(new AppError("Invalid access token", 401));
  }
}
