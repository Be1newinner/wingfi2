import { IMAGE_SIZES, IMAGE_TYPES_ENUM } from "@/config/constants";
import {
  deleteFileFromFirebaseStorage,
  uploadFileToFirebaseStorage,
} from "@/services/uploads.service";
import AppError from "@/utils/AppError";
import { SendResponse } from "@/utils/JsonResponse";
import { NextFunction, Request, Response } from "express";
import sharp from "sharp";

export async function compressImage(
  file: Express.MulterMulter.File,
  type: IMAGE_TYPES_ENUM
) {
  const config = IMAGE_SIZES[type];

  const buffer = await sharp(file.buffer)
    .resize(config.width, config.height, {
      fit: "cover",
    })
    .toFormat("webp", {
      quality: 80,
    })
    .toBuffer();

  const updatedFile: Express.MulterMulter.File = {
    ...file,
    originalname: file.originalname.replace(/\.\w+$/, ".webp"),
    mimetype: "image/webp",
    buffer,
  };

  return updatedFile;
}

export async function uploadImagesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const files = req.files as Express.MulterMulter.File[];
    const typeParam = req.query?.type;

    if (
      !typeParam ||
      !Object.values(IMAGE_TYPES_ENUM).includes(typeParam as IMAGE_TYPES_ENUM)
    ) {
      return next(new AppError("Invalid image type provided", 400));
    }

    const type = typeParam as IMAGE_TYPES_ENUM;

    if (!files || files.length === 0) {
      return next(new AppError("No images provided", 400));
    }

    const uploadPromises = files.map((file) =>
      compressImage(file, type).then((compressedFile) =>
        uploadFileToFirebaseStorage(compressedFile)
      )
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
