import AppError from "@/utils/AppError";
import { SendResponse } from "@/utils/JsonResponse";
import { NextFunction, Request, Response } from "express";

export async function uploadImagesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const images = req.files;

    console.log(images);

    SendResponse(res, {
      message: "Images uploaded success!",
      status_code: 200,
    });
  } catch (error) {
    const errorMessage = (error as Error).message || "Images uploading Failed!";

    next(new AppError(errorMessage, 500));
  }
}

export async function deleteImagesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    SendResponse(res, {
      message: "Images deleted success!",
      status_code: 200,
    });
  } catch (error) {
    const errorMessage = (error as Error).message || "Images deletion Failed!";

    next(new AppError(errorMessage, 500));
  }
}
