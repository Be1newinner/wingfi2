import AppError from "@/utils/AppError";
import { NextFunction, Request, Response } from "express";

export default function IsAdminMiddleware(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const user = req.user;

  if (user?.role !== "ADMIN")
    next(
      new AppError(
        "Admin permission is required to perform this operation.",
        401
      )
    );
  next();
}
