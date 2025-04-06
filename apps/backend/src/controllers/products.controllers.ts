import { NextFunction, Request, Response } from "express";
import { SendResponse } from "../utils/JsonResponse.ts";
import { ProductModel } from "../models/product.model.ts";
import AppError from "../utils/AppError.ts";
import { MongooseError } from "mongoose";
import { MongoError } from "mongodb";

export const ProductsListController = (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    SendResponse(res, {
      status_code: 200,
      message: "Products fetched successfully!",
    });
  } catch (error: unknown) {
    console.error(error);

    const errMessage =
      error instanceof AppError ? error.message : "Unknown Error!";

    const errCode = error instanceof AppError ? error.statusCode : 500;

    return next(new AppError(errMessage, errCode));
  }
};

export const AddNewProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sku, title, description, price, mrp, image, images, variants } =
      req.body;

    if (!title || !price || !sku)
      return next(new AppError("title, sku, and price are required!", 400));

    const product = new ProductModel({
      sku,
      title,
      description,
      price,
      mrp,
      image,
      images,
      variants,
    });

    const resp = await product.save();

    SendResponse(res, {
      status_code: 201,
      message: "Product added successfully!",
      meta: { id: resp._id },
    });
  } catch (error: unknown) {
    let statusCode = 500;
    let errMessage = "Unknown Error!";

    if (error instanceof AppError) {
      errMessage = error.message;
      statusCode = error.statusCode;
    }

    if (
      error instanceof MongooseError &&
      (error as MongoError).code === 11000
    ) {
      statusCode = 409;
      errMessage = `Product with this SKU already exists!`;
    }

    return next(new AppError(errMessage, statusCode));
  }
};
