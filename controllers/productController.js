const uuid = require("uuid");
const path = require("path");
const {
  Product,
  Like,
  Rating,
  ProductSubcategory,
  BasketProduct,
  Basket,
} = require("../models");
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
    const { imgs } = req.files;
    if (!imgs) {
      return next(ApiError.incorrectRequest("imgs_is_empty"));
    }

    let fileNames = Array.isArray(imgs)
      ? imgs.map(() => uuid.v4() + ".jpg")
      : [uuid.v4() + ".jpg"];

    const product = await Product.create({
      en,
      ua,
      ru,
      price,
      categoryCode,
      imgs: fileNames.join("/"),
      descriptionEn,
      descriptionUa,
      descriptionRu,
    });

    if (Array.isArray(imgs)) {
      imgs.forEach((image, index) => {
        image.mv(path.resolve(__dirname, "..", "public", fileNames[index]));
      });
    } else {
      imgs.mv(path.resolve(__dirname, "..", "public", fileNames[0]));
    }

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
      "priceWithDiscount",
      "imgs",
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
    const { id, userId } = req.params;
    const productPromise = Product.findOne({ where: { id } });
    const likesCountPromise = Like.count({ where: { productId: id } });
    const ratingsPromise = Rating.findAll({ where: { productId: id } });
    const userRatingPromise = Rating.findOne({
      where: { userId: userId || 0, productId: id },
    });
    let basket;
    let isInBasket = false;
    if (userId) {
      basket = await Basket.findOne({ where: { userId } });
    }
    if (basket) {
      isInBasket = !!(await BasketProduct.findOne({
        where: { productId: id, basketId: basket.id },
      }));
    }

    const [ratings, likesCount, product, userRating] = await Promise.allSettled(
      [ratingsPromise, likesCountPromise, productPromise, userRatingPromise]
    );

    const averageRating =
      ratings.value.reduce((acc, val) => acc + val.rate, 0) /
      (ratings.value.length || 1);

    return res.json(
      product
        ? {
            ...product.value.dataValues,
            likesCount: likesCount.value,
            rating: {
              average: Number(!ratings.value ? 0 : averageRating.toFixed(1)),
              user: userRating.value ? userRating.value.rate : 0,
            },
            isInBasket,
          }
        : undefined
    );
  } catch (error) {
    next(new ApiError(error.message));
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
const addRate = async (req, res, next) => {
  try {
    const { rate } = req.body;
    const { productId } = req.params;
    let rating;
    if (!productId) {
      return next(ApiError.incorrectRequest("productId is required"));
    }
    if (!rate) {
      return next(ApiError.incorrectRequest("rate is required"));
    }

    const userRate = await Rating.findOne({
      where: { productId, userId: req.user.id },
    });
    if (userRate) {
      rating = await userRate.update({ rate });
    } else {
      rating = await Rating.create({
        userId: req.user.id,
        productId,
        rate,
      });
    }
    const ratings = await Rating.findAll({ where: { productId } });
    const averageRating =
      ratings.reduce((acc, val) => acc + val.rate, 0) / (ratings.length || 1);

    return res.json({
      productId,
      rate,
      averageRating: !ratings ? 0 : averageRating.toFixed(1),
    });
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
    const attributes = [
      "id",
      "en",
      "ua",
      "ru",
      "price",
      "sale",
      "imgs",
      "categoryCode",
    ];

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
      attributes,
    });

    return res.json(likedProducts);
  } catch (error) {
    next(ApiError.incorrectRequest(error.message));
  }
};
const getProductsWithSubcategory = async (req, res, next) => {
  try {
    const { subcategoryCode } = req.params;
    const attributes = [
      "id",
      "en",
      "ua",
      "ru",
      "price",
      "sale",
      "imgs",
      "categoryCode",
    ];

    const productSubcategories = await ProductSubcategory.findAll({
      where: {
        subcategoryCode,
      },
    });
    const productIds = productSubcategories.map((ps) => ps.productId);
    const products = await Product.findAndCountAll({
      where: {
        id: { [Op.in]: productIds },
      },
      attributes,
    });

    return res.json(products);
  } catch (error) {
    return next(ApiError.incorrectRequest(error.message));
  }
};
const setDiscount = async (req, res, next) => {
  try {
    const { dropTo, discountPercent } = req.body;
    const { productId } = req.params;

    if (!dropTo && !discountPercent && discountPercent !== 0) {
      return next(ApiError.incorrectRequest("without_body_discount"));
    }
    if (!productId) {
      return next(ApiError.incorrectRequest("productId_is_undefined"));
    }

    const product = await Product.findOne({ where: { id: productId } });

    if (dropTo) {
      const discount = Number(
        ((100 - (dropTo * 100) / product.dataValues.price) / 100).toFixed(3)
      );
      await product.update({
        sale: discount,
        priceWithDiscount: dropTo || null,
      });
      return res.json({ discount, priceWithDiscount: Number(dropTo) || null });
    }

    if (discountPercent || discountPercent === 0) {
      const discountedValue = Math.round(
        product.dataValues.price * discountPercent
      );
      let newPrice;
      if (discountedValue) {
        newPrice = product.dataValues.price - discountedValue;
      } else {
        newPrice = null;
      }
      await product.update({
        sale: discountPercent,
        priceWithDiscount: newPrice,
      });
      return res.json({
        discount: discountPercent,
        priceWithDiscount: newPrice,
      });
    }
  } catch (error) {
    return next(new ApiError(400, error.message, "try-catch server error"));
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
  addRate,
  getProductsWithSubcategory,
  setDiscount,
};
