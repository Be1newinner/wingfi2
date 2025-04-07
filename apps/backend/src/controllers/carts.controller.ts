import AppError from "../utils/AppError.ts";

import { CartModel } from "../models/carts.model.ts";
import { TAX } from "../constants/rates.ts";
import { ProductModel } from "../models/product.model.ts";
import { Types } from "mongoose";
import { UserModel } from "../models/users.model.ts";
import { NextFunction, Request, Response } from "express";

async function increaseItemQuanityInCartController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { product_id, action = "INCREASE" } = req.body;
    const quantity = 1;

    const _id = req.user?._id;

    if (!product_id || !_id || !action || !quantity)
      return res.send({
        error: "All keys are required. product_id, uid, action, quantity!",
        data: null,
      });

    const userId = new Types.ObjectId(_id);
    const productId = new Types.ObjectId(product_id);

    // Checking if User Exist
    const userExist = await UserModel.exists({ _id: userId });
    if (!userExist) throw new Error("User doesn't exist!");

    // Checking if Product Exist
    const product = await ProductModel.findById(productId)
      .select({
        price: true,
        mrp: true,
        discount: true,
      })
      .lean();
    if (!product) throw new Error("Product doesn't exist!");

    const taxCalculated = TAX * product.price * quantity;
    const totalPrice = product.price * quantity;
    // const totalMrp = product.mrp * quantity;

    // Updateing Cart
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

    // We will use this to add a new product in Cart if it was not found in step 3

    if (action == "INCREASE" && updatedProduct.matchedCount == 0) {
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

      return res.send({
        data: updatedProduct,
        error: null,
        message: "Item added to the array!",
      });
    } else {
      await CartModel.deleteOne({ _id: userId, total: { $lte: 0 } });

      return res.send({
        data: updatedProduct,
        error: null,
        message: "Quantity updated for product!",
      });
    }
  } catch (error) {
    const errMessage =
      error instanceof AppError ? error.message : "Cart updating failed!";

    const errCode = error instanceof AppError ? error.statusCode : 500;

    return next(new AppError(errMessage, errCode));
  }
}

async function getCartController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const _id = req.user?._id;

    const data = await CartModel.findById(_id);

    if (!data) return next(new AppError("No Products Found!", 404));

    return res.status(200).json({
      message: "Products Fetched Successfully!",
      data,
    });
  } catch (error) {
    const errMessage =
      error instanceof AppError ? error.message : "Cart updating failed!";

    const errCode = error instanceof AppError ? error.statusCode : 500;

    return next(new AppError(errMessage, errCode));
  }
}

export { increaseItemQuanityInCartController, getCartController };
