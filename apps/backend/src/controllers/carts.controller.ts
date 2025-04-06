const { CartModel } = require("../models/carts.model.js");
const { TAX } = require("../constants/rates.js");
const { ProductModel } = require("../models/products.model.js");
const { Types } = require("mongoose");
const { UserModel } = require("../models/users.model.js");

async function increaseItemQuanityInCartController(req, res) {
  try {
    const {
      product_id,
      action = "INCREASE",
    } = req.body;
    const quantity = 1;
    const { uid } = req.locals

    if (!product_id || !uid || !action || !quantity) return res.send({
      error: "All keys are required. product_id, uid, action, quantity!",
      data: null
    })

    // Expected Vaue in action = INCREASE | DECREASE
    const userId = new Types.ObjectId(uid);
    const productId = new Types.ObjectId(product_id);

    // Step 1. Check if User Exist
    const userExist = await UserModel.exists({ _id: userId });
    if (!userExist) throw new Error("User doesn't exist!")

    // Step 2. Check if Product Exist
    const product = await ProductModel.findById(productId).select("price mrp discount").lean()
    if (!product) throw new Error("Product doesn't exist!")

    const taxCalculated = TAX * product.price * quantity;
    const totalPrice = product.price * quantity;
    const totalMrp = product.mrp * quantity;

    // Step 3. Update Cart
    let factor = action === "INCREASE" ? 1 : -1;

    [{
      $set: {
        items: {
          $filter: {
            input: "$items",
            as: "item",
            cond: {
              $gt: ["$$item.qty", 0]
            }
          }
        }
      },
    },
    {
      $set: {
        "items": {
          "$cond": {
            "if": { "$eq": [{ $size: "$items" }, 0] },
            "then": "$$REMOVE",
            else: "$items"
          }
        }
      }
    }
    ]

    let updatedProduct = await CartModel.updateOne(
      { _id: userId, "items._id": productId },
      [
        // 1st Pipeline
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
                              then: { $max: [{ $add: ["$$item.qty", factor] }, 0] },
                              else: "$$item.qty",
                            },
                          },
                          subtotal: {
                            $cond: {
                              if: { $eq: ["$$item._id", productId] },
                              then: { $max: [{ $add: ["$$item.subtotal", factor * totalPrice] }, 0] },
                              else: "$$item.subtotal",
                            },
                          },
                          price: {
                            $cond: {
                              if: { $eq: ["$$item._id", productId] },
                              then: { $max: [{ $add: ["$$item.price", factor * (totalPrice + taxCalculated)] }, 0] },
                              else: "$$item.price",
                            },
                          },
                          tax: {
                            $cond: {
                              if: { $eq: ["$$item._id", productId] },
                              then: { $max: [{ $add: ["$$item.tax", factor * taxCalculated] }, 0] },
                              else: "$$item.tax",
                            },
                          },
                          discount: {
                            $cond: {
                              if: { $eq: ["$$item._id", productId] },
                              then: { $max: [{ $add: ["$$item.discount", factor * product.discount] }, 0] },
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
                  $gt: ["$$item.qty", 0]
                }
              }
            },
            total: { $max: [{ $add: ["$total", factor * (totalPrice + taxCalculated)] }, 0] },
            subtotal: { $max: [{ $add: ["$subtotal", factor * totalPrice] }, 0] },
            discount: { $max: [{ $add: ["$discount", factor * product.discount] }, 0] },
            tax: { $max: [{ $add: ["$tax", factor * taxCalculated] }, 0] },
          },
        },
      ],
      { upsert: false }
    );

    // Step 4. We will use this to add a new product in Cart if it was not found in step 3 

    if (action == "INCREASE" && updatedProduct.matchedCount == 0) {
      updatedProduct = await CartModel.updateOne({
        _id: userId
      }, {
        $push: {
          items: {
            qty: quantity,
            _id: productId,
            price: totalPrice + taxCalculated,
            subtotal: totalPrice,
            discount: product.discount,
            tax: taxCalculated,
          }
        },
        $inc: {
          total: totalPrice + taxCalculated,
          subtotal: totalPrice,
          discount: product.discount,
          tax: taxCalculated,
        }
      }, {
        upsert: true
      })

      return res.send({
        data: updatedProduct,
        error: null,
        message: "Item added to the array!"
      });
    } else {
      await CartModel.deleteOne({ _id: userId, total: { $lte: 0 } });

      return res.send({
        data: updatedProduct,
        error: null,
        message: "Quantity updated for product!"
      });
    }


  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message, data: null });
  }
}

async function getCartController(req, res) {
  try {
    const { uid } = req.locals

    const data = await CartModel.find({
      _id: uid
    });

    if (!data) {
      return res.status(404).json({
        message: "No Products Found!",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Products Fetched Successfully!",
      data,
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      data: null,
    });
  }
}

module.exports = {
  increaseItemQuanityInCartController,
  getCartController
}