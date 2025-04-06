import { NextFunction, Request, Response } from "express";
import { SendResponse } from "../utils/JsonResponse.ts";
import { ProductModel } from "../models/product.model.ts";
import AppError from "../utils/AppError.ts";
import { MongooseError } from "mongoose";

export const ProductsListController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const limit = Math.max(Math.min(Number(req.query.limit) || 6, 8), 1);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    const products = await ProductModel.find()
      .select({
        sku: true,
        name: true,
        price: true,
        stock: true,
        image: true,
      })
      .limit(limit)
      .skip(skip)
      .lean();

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
    const { sku } = req.params;
    const data = await ProductModel.findOne({ sku }).lean();

    if (!data) {
      res.status(404).json({
        error: "Product not found",
        message: "",
        data: null,
      });
      return;
    }

    SendResponse(res, {
      status_code: 200,
      message: "Products fetched successfully!",
    });
  } catch (error: unknown) {
    console.error(error);

    const errMessage =
      error instanceof AppError ? error.message : "Product fetching failed!";

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
export async function AddListOfProductsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body;

    if (!Array.isArray(body) || body.length === 0)
      return next(new AppError("Product list is required!", 400));

    const data = await ProductModel.insertMany(body);

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
export async function UpdateSingleProductController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, category, price, mrp, stock, sku, description, rating } =
      req.body;

    if (!sku) return next(new AppError("SKU is Required!", 400));

    if (!(name || category || price || mrp || stock || description || rating))
      return next(
        new AppError("Atleast one field to update is required!", 400)
      );

    const updatedData = await ProductModel.findOneAndUpdate(
      { sku },
      { name, category, price, mrp, stock, description, rating },
      { new: true }
    );

    if (!updatedData) return next(new AppError("Product not found!", 404));

    SendResponse(res, {
      status_code: 200,
      message: "Product updated successfully!",
      meta: { id: updatedData._id },
      data: updatedData,
    });
  } catch (error) {
    console.error(error);

    const errMessage =
      error instanceof AppError ? error.message : "Product updating failed!";

    const errCode = error instanceof AppError ? error.statusCode : 500;

    return next(new AppError(errMessage, errCode));
  }
}

// Delete Product by SKU
export async function deleteProductByID(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { sku } = req.params;

    const deletedProduct = await ProductModel.findOneAndDelete({ sku });

    if (!deletedProduct) return next(new AppError("Product not found!", 404));

    SendResponse(res, {
      status_code: 204,
      message: "Product deleted successfully!",
      meta: { id: deletedProduct._id },
    });
  } catch (error) {
    console.error(error);

    const errMessage =
      error instanceof AppError ? error.message : "Failed to delete product!";

    const errCode = error instanceof AppError ? error.statusCode : 500;

    return next(new AppError(errMessage, errCode));
  }
}
