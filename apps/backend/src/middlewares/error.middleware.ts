import { NextFunction, Request, Response } from "express";
import { SendResponse } from "../utils/JsonResponse";
import AppError from "../utils/AppError";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // console.error("Error:", err);
  // console.log({ ERROR: "ERROR MIDDLEWARE" });

  if (!res || typeof res.status !== "function") return;

  let message = "Internal Server Error!";
  let status_code = 500;

  if (err instanceof AppError) {
    message = err.message;
    status_code = err.statusCode;
  }

  SendResponse(res, { message, status_code, status: "error" });
}
