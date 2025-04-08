import { Router } from "express";
import {} from "../controllers/users.controller";
import { uploadProductImage } from "@/middlewares/upload.middleware";
import {
  deleteImagesController,
  uploadImagesController,
} from "@/controllers/uploads.controller";

export const UploadRouter = Router();

UploadRouter.post(
  "/images/",
  uploadProductImage.array("images", 4),
  uploadImagesController
);
UploadRouter.delete("/images/", deleteImagesController);
