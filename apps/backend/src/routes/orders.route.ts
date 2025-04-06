const { Router } = require("express");
const {
    generateOrder,
    getAllOrdersByUID,
    getOrderDetailsByID,
    updateOrderByID
} = require("../controllers/orders.controller.js");
const { VerifyAccessTokenMiddleWare } = require("../middleware/VerifyAccessToken.js");

const OrderRouter = Router()

OrderRouter.post("/", VerifyAccessTokenMiddleWare, generateOrder)
OrderRouter.get("/all", VerifyAccessTokenMiddleWare, getAllOrdersByUID)
OrderRouter.get("/single/:id", VerifyAccessTokenMiddleWare, getOrderDetailsByID)
OrderRouter.patch("/:id", VerifyAccessTokenMiddleWare, updateOrderByID)

module.exports = {
    OrderRouter
}