const { Router } = require("express");
const { basketController } = require("../controllers/basketController");
const authMiddleware = require("../middleware/authMiddleware");

const basketRouter = new Router()

basketRouter.post("/", authMiddleware, basketController.createBasket)
basketRouter.get("/", authMiddleware, basketController.getUserBasket)
basketRouter.post("/product", authMiddleware, basketController.createBasketProduct)

module.exports = basketRouter