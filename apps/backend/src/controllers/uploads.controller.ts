import {
  deleteFileFromFirebaseStorage,
  uploadFileToFirebaseStorage,
} from "@/services/uploads.service";
import AppError from "@/utils/AppError";
import { SendResponse } from "@/utils/JsonResponse";
import { NextFunction, Request, Response } from "express";

export async function uploadImagesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const files = req.files as Express.MulterMulter.File[];

    if (!files || files.length === 0) {
      throw new AppError("No images provided", 400);
    }

    const uploadPromises = files.map((file) =>
      uploadFileToFirebaseStorage(file)
    );
    const uploadedUrls = await Promise.all(uploadPromises);

    SendResponse(res, {
      data: uploadedUrls,
      message: "Images uploaded successfully!",
      status_code: 200,
    });
  } catch (error) {
    next(
      new AppError((error as Error).message || "Image uploading failed!", 500)
    );
  }
}

export async function deleteImagesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const imageUrls = req.body as string[];

    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return next(
        new AppError("Please pass an array of image URLs to delete", 400)
      );
    }

    if (imageUrls.length > 4) {
      return next(new AppError("You can delete up to 4 images at a time", 400));
    }

    const deleteResults = await Promise.all(
      imageUrls.map((url) => deleteFileFromFirebaseStorage(url))
    );

    SendResponse(res, {
      message: "Images deleted successfully!",
      status_code: 200,
      data: deleteResults,
    });
  } catch (error) {
    next(
      new AppError((error as Error).message || "Images deletion failed!", 500)
    );
  }
}

