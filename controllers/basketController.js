const { Op } = require("sequelize");
const ApiError = require("../err/ApiError");
const { BasketProduct, Basket, Product } = require("../models");

class BasketController {
  async createBasketProduct(req, res, next) {
    try {
      const { productId, basketId } = req.body;
      if (!productId) {
        return next(ApiError.incorrectRequest("productId_is_undefined"));
      }
      if (!basketId) {
        return next(ApiError.incorrectRequest("basketId_is_undefined"));
      }
      const isCreated = await BasketProduct.findOne({
        where: { basketId, productId },
      });
      if (isCreated) {
        return next(ApiError.incorrectRequest("product_already_in_basket"));
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

  async getUserBasketProducts(req, res, next) {
    try {
      const { basketId } = req.params;
      const getProductCount = (basketProducts, productId) => {
        let count = 1;
        basketProducts.forEach((bp) => {
          if (productId === bp.productId) {
            count = bp.count;
          }
        });
        return count;
      };

      const basketProducts = await BasketProduct.findAll({
        where: { basketId },
      });
      const productIds = basketProducts.map((bp) => bp.productId);
      let products = await Product.findAll({
        where: {
          id: { [Op.in]: productIds },
        },
        attributes: ["en", "ua", "ru", "id", "imgs", "price", "sale"],
      });
      products = products.map((p) => {
        return {
          ...p.dataValues,
          count: getProductCount(basketProducts, p.id),
        };
      });
      return res.json(products);
    } catch (error) {
      return next(new ApiError(400, error.message));
    }
  }

  async setBasketCount(req, res, next) {
    try {
      const { productId } = req.params;
      const basket = await Basket.findOne({ where: { userId: req.user.id } });
      const basketProduct = await BasketProduct.findOne({
        where: {
          basketId: basket.id,
          productId,
        },
      });
      if (req.body.count !== basketProduct.count) {
        basketProduct.update({ count: req.body.count });
      }

      return res.json(basketProduct);
    } catch (error) {
      return next(new ApiError(error.message));
    }
  }
}

const basketController = new BasketController();

module.exports = { basketController };
