import { NextFunction, Request, Response } from "express";
import { SendResponse } from "../utils/JsonResponse.ts";
import AppError from "../utils/AppError.ts";

export function errorHandler(
  err: unknown,
  _: Request,
  res: Response,
  __: NextFunction
) {
  // console.error("Error:", err);

  console.log(typeof res);

  if (!res || typeof res.status !== "function") return;

  let message = "Internal Server Error!";
  let status_code = 500;

  if (err instanceof AppError) {
    message = err.message;
    status_code = err.statusCode;
  }

  SendResponse(res, { message, status_code });
}
