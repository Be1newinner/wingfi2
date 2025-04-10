import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import AppError from "@/utils/AppError";

type ZodSchema = {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
};

export const validateRequest =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schema.body) schema.body.parse(req.body);
      if (schema.query) schema.query.parse(req.query);
      if (schema.params) schema.params.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.errors.map((e) => e.message).join(", ");
        return next(new AppError(message, 400));
      }
      return next(new AppError("Validation failed", 400));
    }
  };
