import { NextFunction, Request, Response } from "express";
import { SendResponse } from "../utils/JsonResponse";
import AppError from "../utils/AppError";
import { MongooseError } from "mongoose";
import {
  addListOfProductsService,
  addProductService,
  deleteProductService,
  fetchProductService,
  fetchProductsListService,
  updateProductService,
} from "@/services/products.service";
import {
  addProductZodType,
  deleteProductZodType,
  fetchProductsListZodType,
  fetchProductZodType,
  updateProductZodType,
} from "@/validations/product.validation";

export const fetchProductsListController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await fetchProductsListService(
      req.query as unknown as fetchProductsListZodType
    );

    SendResponse(res, {
      status_code: 200,
      message: "Data Retrieved Successfully!",
      data: products,
    });
  } catch (error: unknown) {
    // console.error(error);

    const errMessage =
      error instanceof AppError ? error.message : "Products fetching failed!";

    const errCode = error instanceof AppError ? error.statusCode : 500;

    return next(new AppError(errMessage, errCode));
  }
};

export const fetchProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await fetchProductService(
      req.params as fetchProductZodType,
      next
    );

    SendResponse(res, {
      status_code: 200,
      message: "Products fetched successfully!",
      data,
    });
  } catch (error: unknown) {
    // console.error(error);

    const errMessage =
      error instanceof AppError ? error.message : "Product fetching failed!";

    const errCode = error instanceof AppError ? error.statusCode : 500;

    return next(new AppError(errMessage, errCode));
  }
};

export const addProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newProduct = await addProductService(req.body as addProductZodType);

    if (newProduct) {
      SendResponse(res, {
        status_code: 201,
        message: "Product added successfully!",
        meta: { id: newProduct._id },
      });
    }
  } catch (error: unknown) {
    let statusCode = 500;
    let errMessage = "Product adding failed!";

    if (error instanceof AppError) {
      errMessage = error.message;
      statusCode = error.statusCode;
    }

    if (error instanceof MongooseError) {
      console.log(error.name);
      statusCode = 409;
      errMessage = `Product with this SKU already exists!`;
    }

    return next(new AppError(errMessage, statusCode));
  }
};

// Add Multiple Products
export async function addListOfProductsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await addListOfProductsService(req.body);

    SendResponse(res, {
      status_code: 201,
      message: "Products added successfully!",
      data,
    });
  } catch (error) {
    // console.error(error);

    const errMessage =
      error instanceof AppError ? error.message : "Failed to add products!";

    const errCode = error instanceof AppError ? error.statusCode : 500;

    return next(new AppError(errMessage, errCode));
  }
}

// Update Single Product by SKU
export const updateProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updated = await updateProductService(
      req.body as updateProductZodType
    );
    SendResponse(res, {
      data: updated,
      status_code: 200,
      message: "Product updated successfully!",
    });
  } catch (error) {
    // console.error(error);
    const errMessage =
      error instanceof AppError ? error.message : "Failed to update product!";
    const errCode = error instanceof AppError ? error.statusCode : 500;
    next(new AppError(errMessage, errCode));
  }
};

// Delete Product by SKU
export async function deleteProductByID(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const deletedProduct = await deleteProductService(
      req.params as deleteProductZodType,
      next
    );

    if (deletedProduct) {
      SendResponse(res, {
        status_code: 204,
        message: "Product deleted successfully!",
      });
    }
  } catch (error) {
    // console.error(error);

    const errMessage =
      error instanceof AppError ? error.message : "Failed to delete product!";
    const errCode = error instanceof AppError ? error.statusCode : 500;
    return next(new AppError(errMessage, errCode));
  }
}
