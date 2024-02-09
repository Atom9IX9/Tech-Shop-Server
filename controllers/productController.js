const uuid = require("uuid");
const path = require("path");
const { Product, Like } = require("../models");
const ApiError = require("../err/ApiError");
const { Op } = require("sequelize")

const create = async (req, res, next) => {
  try {
    const { en, ua, ru, price, categoryCode } = req.body;
    const { img } = req.files;
    let fileName = uuid.v4() + ".jpg";

    const product = await Product.create({
      en,
      ua,
      ru,
      price,
      categoryCode,
      img: fileName,
    });

    img.mv(path.resolve(__dirname, "..", "public", fileName));
    return res.json(product);
  } catch (error) {
    next(ApiError.incorrectRequest(error.message));
  }
};
const getAll = async (req, res, next) => {
  try {
    let { category, pageSize, page } = req.query;
    let limit = Number(pageSize) || 10;
    let offset = limit * ((page || 1) - 1);

    let products;

    if (category) {
      products = await Product.findAndCountAll({
        where: { categoryCode: category },
        limit,
        offset,
      });
    } else {
      products = await Product.findAndCountAll({ limit, offset });
    }

    return res.json(products);
  } catch (error) {
    next(ApiError.incorrectRequest(error.message));
  }
};
const getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id } });
    return res.json(product);
  } catch (error) {
    next(ApiError(error.message));
  }
};
const addLike = async (req, res, next) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return next(ApiError.incorrectRequest("product's id is required"));
    }

    const like = await Like.create({ userId: req.user.id, productId });

    return res.json({ productId });
  } catch (error) {
    next(ApiError.incorrectRequest(error.message));
  }
};
const removeLike = async (req, res, next) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return next(ApiError.incorrectRequest("product's id is required"));
    }

    const deletedLike = await Like.destroy({
      where: { userId: req.user.id, productId },
    });

    return res.json({ productId });
  } catch (error) {
    next(ApiError.incorrectRequest(error.message));
  }
};
const getLikedProductIds = async (req, res, next) => {
  try {
    const likes = await Like.findAll({ where: { userId: req.user.id } });

    const likedProductIds = likes.map((like) => {
      return like.productId;
    });

    return res.json({ likedProductIds });
  } catch (error) {
    next(ApiError.incorrectRequest(error.message));
  }
};
const getLikedProducts = async (req, res, next) => {
  try {
    const userLikes = await Like.findAll({where: { userId: req.user.id }})

    const likedProductIds = userLikes.map((like) => {
      return like.productId;
    });

    const likedProducts = await Product.findAll({
      where: {
        id: {
          [Op.in]: likedProductIds
        }
      }
    })

    return res.json(likedProducts)
  } catch (error) {
    next(ApiError.incorrectRequest(error.message));
  }
}

module.exports = {
  create,
  getAll,
  getOne,
  addLike,
  removeLike,
  getLikedProductIds,
  getLikedProducts
};
