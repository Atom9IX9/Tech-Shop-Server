const { Router } = require("express");
const { basketController } = require("../controllers/basketController");
const authMiddleware = require("../middleware/authMiddleware");

const basketRouter = new Router()

basketRouter.post("/", authMiddleware, basketController.createBasket)
basketRouter.get("/", authMiddleware, basketController.getUserBasket)
basketRouter.get("/:basketId/products", authMiddleware, basketController.getUserBasketProducts)
basketRouter.post("/product", authMiddleware, basketController.createBasketProduct)
basketRouter.put("/product/:productId/count", authMiddleware, basketController.setBasketCount)
basketRouter.delete("/product/:productId", authMiddleware, basketController.deleteBasketProduct)

module.exports = basketRouter