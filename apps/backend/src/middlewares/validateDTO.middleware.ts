import AppError from "@/utils/AppError";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { NextFunction, Request, Response } from "express";

export function validate_dto_middleWare(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dtoClass: any,
  from: "body" | "query" | "params" = "body"
) {
  return async function (req: Request, _res: Response, next: NextFunction) {
    const source = req[from];
    const dtoObj = plainToInstance(dtoClass, source);
    const errors = await validate(dtoObj, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const messages = errors
        .flatMap((err) => Object.values(err.constraints || {}))
        .join("; ");
      return next(new AppError(`Validation Error: ${messages}`, 400));
    }

    req[from] = dtoObj;
    next();
  };
}
