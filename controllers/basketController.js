const ApiError = require("../err/ApiError");
const { BasketProduct, Basket } = require("../models");

class BasketController {
  async createBasketProduct(req, res, next) {
    try {
      const { productId, basketId } = req.body;
      if (!productId) {
        return next(ApiError.incorrectRequest("productId_is_undefined"))
      }
      if (!basketId) {
        return next(ApiError.incorrectRequest("basketId_is_undefined"))
      }
      const isCreated = await BasketProduct.findOne({where: { basketId, productId }})
      if (isCreated) {
        return next(ApiError.incorrectRequest("product_already_in_basket"))
      }
      
      const basketProduct = await BasketProduct.create({ productId, basketId });
      return res.json(basketProduct);
    } catch (error) {
      return next(ApiError.incorrectRequest(error.message));
    }
  }

  async createBasket(req, res, next) {
    try {
      const basket = await Basket.create({ userId: req.user.id });
      return res.json(basket);
    } catch (error) {
      return next(ApiError.incorrectRequest(error.message));
    }
  }

  async getUserBasket(req, res, next) {
    try {
      const basket = await Basket.findOne({ where: { userId: req.user.id } });
      return res.json(basket);
    } catch (error) {
      return next(ApiError.incorrectRequest(error.message));
    }
  }
}

const basketController = new BasketController();

module.exports = { basketController };
