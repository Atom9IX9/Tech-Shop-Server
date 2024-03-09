const uuid = require("uuid");
const path = require("path");
const { Product, Like } = require("../models");
const ApiError = require("../err/ApiError");
const { Op } = require("sequelize");

const create = async (req, res, next) => {
  try {
    const {
      en,
      ua,
      ru,
      price,
      categoryCode,
      descriptionEn,
      descriptionUa,
      descriptionRu,
    } = req.body;
    const { img } = req.files;
    let fileName = uuid.v4() + ".jpg";

    const product = await Product.create({
      en,
      ua,
      ru,
      price,
      categoryCode,
      img: fileName,
      descriptionEn,
      descriptionUa,
      descriptionRu,
    });

    img.mv(path.resolve(__dirname, "..", "public", fileName));
    return res.json(product);
  } catch (error) {
    next(ApiError.incorrectRequest(error.message));
  }
};
const updateDescription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { en, ua, ru } = req.body;

    const product = Product.update(
      { descriptionEn: en, descriptionRu: ru, descriptionUa: ua },
      { where: { id } }
    );

    return res.json(product);
  } catch (error) {
    next(ApiError.incorrectRequest(error.message));
  }
};
const getAll = async (req, res, next) => {
  try {
    let { category, pageSize, page, like, likeLng } = req.query;
    let limit = Number(pageSize) || 10;
    let offset = limit * ((page || 1) - 1);
    const attributes = [
      "id",
      "en",
      "ua",
      "ru",
      "price",
      "sale",
      "img",
      "categoryCode",
    ];

    let products;

    if (category) {
      products = await Product.findAndCountAll({
        where: { categoryCode: category },
        limit,
        offset,
      });
    } else if (like) {
      if (!likeLng) {
        return next(ApiError.incorrectRequest("likeLng_is_undefined"));
      }
      let where = {};
      switch (likeLng) {
        case "en": {
          where = { en: { [Op.like]: `%${like}%` } };
          break;
        }
        case "ua": {
          where = { ua: { [Op.like]: `%${like}%` } };
          break;
        }
        case "ru": {
          where = { ru: { [Op.like]: `%${like}%` } };
          break;
        }
      }
      products = await Product.findAndCountAll({
        limit,
        offset,
        where,
        attributes,
      });
    } else {
      products = await Product.findAndCountAll({
        limit,
        offset,
        attributes,
      });
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
    const likesCount = await Like.count({ where: { productId: id } });
    return res.json(
      product ? { ...product.dataValues, likesCount } : undefined
    );
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
    const userLikes = await Like.findAll({ where: { userId: req.user.id } });

    const likedProductIds = userLikes.map((like) => {
      return like.productId;
    });

    const likedProducts = await Product.findAll({
      where: {
        id: {
          [Op.in]: likedProductIds,
        },
      },
    });

    return res.json(likedProducts);
  } catch (error) {
    next(ApiError.incorrectRequest(error.message));
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  addLike,
  removeLike,
  getLikedProductIds,
  getLikedProducts,
  updateDescription,
};
