import { ProductModel } from "@/models/product.model";
import { IProduct } from "@/types/product.types";
import AppError from "@/utils/AppError";
import {
  addProductZodType,
  deleteProductZodType,
  fetchProductsListZodType,
  fetchProductZodType,
  updateProductZodType,
} from "@/validations/product.validation";
import { NextFunction } from "express";
import { DeleteResult } from "mongoose";
// import { validateVariantsToAdd } from "../validators/product.validator";

export const validateVariantsToAdd = (
  existingVariants: { color: string; url: string }[],
  newVariants: { color: string; url: string }[]
) => {
  const existingColors = new Set(existingVariants.map((v) => v.color));
  return existingVariants.length
    ? newVariants
        .filter((v) => v.color?.trim() && v.url?.trim())
        .filter((v) => !existingColors.has(v.color))
    : newVariants;
};

export const updateProductService = async (body: updateProductZodType) => {
  const {
    sku,
    title,
    category,
    price,
    mrp,
    description,
    rating,
    stock,
    addImages,
    removeImages,
    addVariants,
    removeVariants,
    updateImageOfVariant,
  } = body;

  const product = await ProductModel.findOne(
    { sku },
    { variants: true, _id: false }
  );
  if (!product) throw new Error("Product not found");

  const validVariantsToAdd = validateVariantsToAdd(
    product?.variants || [],
    addVariants || []
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateQuery: any = {
    $set: {
      title,
      category,
      price,
      mrp,
      description,
      rating,
      ...(updateImageOfVariant?.url &&
        updateImageOfVariant?.color && {
          "variants.$[elem].url": updateImageOfVariant.url,
        }),
    },
  };

  if (stock) {
    updateQuery.$inc = { stock };
  }

  if (addImages?.length) {
    updateQuery.$addToSet = {
      ...(updateQuery.$addToSet || {}),
      images: { $each: addImages },
    };
  }

  if (validVariantsToAdd?.length) {
    updateQuery.$addToSet = {
      ...(updateQuery.$addToSet || {}),
      variants: { $each: validVariantsToAdd },
    };
  }

  if (removeImages?.length) {
    updateQuery.$pull = {
      ...(updateQuery.$pull || {}),
      images: { $in: removeImages },
    };
  }

  if (removeVariants?.length) {
    updateQuery.$pull = {
      ...(updateQuery.$pull || {}),
      variants: {
        color: { $in: removeVariants },
      },
    };
  }

  return await ProductModel.findOneAndUpdate({ sku }, updateQuery, {
    new: true,
    arrayFilters: [{ "elem.color": updateImageOfVariant?.color }],
  });
};

export async function fetchProductsListService(
  query: fetchProductsListZodType
) {
  const limit = Number(query.limit);
  const page = Number(query.page);
  const skip = (page - 1) * limit;

  return await ProductModel.find()
    .select({
      sku: true,
      title: true,
      price: true,
      stock: true,
      images: true,
    })
    .limit(limit)
    .skip(skip)
    .lean();
}

export async function fetchProductService(
  params: fetchProductZodType,
  next: NextFunction
) {
  const { sku } = params;
  const data = await ProductModel.findOne({ sku }).lean();

  if (!data) return next(new AppError("Product not found!", 404));
  return data;
}

export async function addProductService(
  body: addProductZodType
): Promise<IProduct | undefined> {
  const { sku, title, description, price, mrp, images, variants } = body;

  return await ProductModel.create({
    sku,
    title,
    description,
    price,
    mrp,
    images,
    variants,
  });
}

export async function addListOfProductsService(products: IProduct[]) {
  return await ProductModel.insertMany(products);
}

export async function deleteProductService(
  params: deleteProductZodType,
  next: NextFunction
): Promise<DeleteResult | undefined> {
  const { sku } = params;
  const deletedProduct = await ProductModel.deleteOne({ sku });

  if (!deletedProduct.deletedCount)
    next(new AppError("Product not found!", 404));

  return;
}
