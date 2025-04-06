import { AddressModel } from "../models/";
import { CartModel } from "../models/carts.model.ts";
import { OrderModel } from "../models/orders.model.ts";

const getOrderDetailsByID = (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Unable to retrieve Order Detail",
      data: null,
    });
  }
};

const getAllOrdersByUID = (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Unable to retrieve orders",
      data: null,
    });
  }
};

const updateOrderByID = (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Unable to update order detail",
      data: null,
    });
  }
};

const generateOrder = async (req, res) => {
  try {
    const { address, shippingFee } = req.body;

    const { uid } = req.locals;

    const cartData = await CartModel.findById(uid)
      .select({
        discount: true,
        total: true,
        subtotal: true,
        items: true,
        tax: true,
        _id: false,
      })
      .lean();

    if (!cartData) throw new Error("Cart Doesn't Exist for this User!");

    // console.log({ cartData });

    const addressData = await AddressModel.findOne({ _id: address, uid })
      .select({
        name: true,
        phone: true,
        address1: true,
        address2: true,
        city: true,
        state: true,
        zipcode: true,
        _id: false,
      })
      .lean();

    if (!addressData)
      throw new Error("This Address Doesn't Exist for this User!");

    const orderResponse = await OrderModel.insertOne({
      address: {
        name: addressData.name,
        phone: addressData.phone,
        address1: addressData.address1,
        address2: addressData.address2,
        city: addressData.city,
        state: addressData.state,
        zipcode: addressData.zipcode,
      },
      items: cartData.items,
      uid,
      shippingFee,
      subtotal: cartData.subtotal,
      tax: cartData.tax,
      discount: cartData.discount,
    });

    await CartModel.deleteOne({ _id: uid });

    res.status(201).json({
      error: null,
      message: "generate Order success!",
      data: orderResponse,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Unable to generate Order!",
      data: null,
    });
  }
};

module.exports = {
  getOrderDetailsByID,
  getAllOrdersByUID,
  updateOrderByID,
  generateOrder,
};
