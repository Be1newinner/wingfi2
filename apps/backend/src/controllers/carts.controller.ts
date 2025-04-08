import AppError from "../utils/AppError";
import { CartModel } from "../models/carts.model";
import { TAX } from "../config/constants";
import { ProductModel } from "../models/product.model";
import { Types } from "mongoose";
import { UserModel } from "../models/users.model";
import { NextFunction, Request, Response } from "express";
import { SendResponse } from "@/utils/JsonResponse";

async function increaseItemQuanityInCartController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { product_id, action = "INCREASE" } = req.body;
    const quantity = 1;

    const _id = req.user?.uid;

    if (!product_id || !_id || !action || !quantity)
      return next(
        new AppError(
          "All keys are required. product_id, uid, action, quantity!",
          401
        )
      );

    const userId = new Types.ObjectId(_id);
    const productId = new Types.ObjectId(product_id);

    const userExist = await UserModel.exists({ _id: userId });
    if (!userExist) return next(new AppError("User doesn't exist!", 404));

    const product = await ProductModel.findById(productId)
      .select({
        price: true,
        mrp: true,
        discount: true,
      })
      .lean();
    if (!product) return next(new AppError("Product doesn't exist!", 404));

    const taxCalculated = TAX * product.price * quantity;
    const totalPrice = product.price * quantity;

    let factor = action === "INCREASE" ? 1 : -1;

    let updatedProduct = await CartModel.updateOne(
      { _id: userId, "items._id": productId },
      [
        {
          $set: {
            items: {
              $filter: {
                input: {
                  $map: {
                    input: "$items",
                    as: "item",
                    in: {
                      $mergeObjects: [
                        "$$item",
                        {
                          qty: {
                            $cond: {
                              if: { $eq: ["$$item._id", productId] },
                              then: {
                                $max: [{ $add: ["$$item.qty", factor] }, 0],
                              },
                              else: "$$item.qty",
                            },
                          },
                          subtotal: {
                            $cond: {
                              if: { $eq: ["$$item._id", productId] },
                              then: {
                                $max: [
                                  {
                                    $add: [
                                      "$$item.subtotal",
                                      factor * totalPrice,
                                    ],
                                  },
                                  0,
                                ],
                              },
                              else: "$$item.subtotal",
                            },
                          },
                          price: {
                            $cond: {
                              if: { $eq: ["$$item._id", productId] },
                              then: {
                                $max: [
                                  {
                                    $add: [
                                      "$$item.price",
                                      factor * (totalPrice + taxCalculated),
                                    ],
                                  },
                                  0,
                                ],
                              },
                              else: "$$item.price",
                            },
                          },
                          tax: {
                            $cond: {
                              if: { $eq: ["$$item._id", productId] },
                              then: {
                                $max: [
                                  {
                                    $add: [
                                      "$$item.tax",
                                      factor * taxCalculated,
                                    ],
                                  },
                                  0,
                                ],
                              },
                              else: "$$item.tax",
                            },
                          },
                          discount: {
                            $cond: {
                              if: { $eq: ["$$item._id", productId] },
                              then: {
                                $max: [
                                  {
                                    $add: [
                                      "$$item.discount",
                                      factor * (product?.discount || 0),
                                    ],
                                  },
                                  0,
                                ],
                              },
                              else: "$$item.discount",
                            },
                          },
                        },
                      ],
                    },
                  },
                },
                as: "item",
                cond: {
                  $gt: ["$$item.qty", 0],
                },
              },
            },
            total: {
              $max: [
                { $add: ["$total", factor * (totalPrice + taxCalculated)] },
                0,
              ],
            },
            subtotal: {
              $max: [{ $add: ["$subtotal", factor * totalPrice] }, 0],
            },
            discount: {
              $max: [
                { $add: ["$discount", factor * (product?.discount || 0)] },
                0,
              ],
            },
            tax: { $max: [{ $add: ["$tax", factor * taxCalculated] }, 0] },
          },
        },
      ],
      { upsert: false }
    );

    if (action == "INCREASE" && updatedProduct.matchedCount === 0) {
      updatedProduct = await CartModel.updateOne(
        {
          _id: userId,
        },
        {
          $push: {
            items: {
              qty: quantity,
              _id: productId,
              price: totalPrice + taxCalculated,
              subtotal: totalPrice,
              discount: product.discount,
              tax: taxCalculated,
            },
          },
          $inc: {
            total: totalPrice + taxCalculated,
            subtotal: totalPrice,
            discount: product.discount,
            tax: taxCalculated,
          },
        },
        {
          upsert: true,
        }
      );

      return SendResponse(res, {
        data: updatedProduct,
        message: "Item added to the array!",
        status_code: 200,
      });
    }

    await CartModel.deleteOne({ _id: userId, total: { $lte: 0 } });

    return SendResponse(res, {
      data: updatedProduct,
      message: "Quantity updated for product!",
      status_code: 200,
    });
  } catch (error) {
    return next(
      new AppError(
        error instanceof AppError ? error.message : "Cart updating failed!",
        error instanceof AppError ? error.statusCode : 500
      )
    );
  }
}

async function getCartController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const _id = req.user?.uid;
    if (!_id) return next(new AppError("Unauthorized user!", 401));

    const data = await CartModel.findById(_id);
    if (!data) return next(new AppError("No Products Found!", 404));

    return SendResponse(res, {
      data,
      message: "Products Fetched Successfully!",
      status_code: 200,
    });
  } catch (error) {
    return next(
      new AppError(
        error instanceof AppError ? error.message : "Cart fetching failed!",
        error instanceof AppError ? error.statusCode : 500
      )
    );
  }
}

export { increaseItemQuanityInCartController, getCartController };
