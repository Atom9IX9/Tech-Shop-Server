const uuid = require("uuid");
const path = require("path");
const { Product } = require("../models");
const ApiError = require("../err/ApiError");

const create = async (req, res, next) => {
  try {
    const { title, price, categoryCode } = req.body;
    const { img } = req.files;
    let fileName = uuid.v4() + ".jpg";

    const product = await Product.create({
      title,
      price,
      categoryCode,
      img: fileName,
    });

    img.mv(path.resolve(__dirname, "..", "static", fileName));
    return res.json(product);
  } catch (error) {
    next(ApiError.incorrectRequest(error.message));
  }
};
const getAll = async (req, res, next) => {
  try {
    let { category, pageSize, page } = req.query;
    let limit = Number(pageSize) || 10;
    let offset = limit * ((page || 1) - 1)

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
    const { id } = req.params
    const product = await Product.findOne({where: {id}})
    return res.json(product)
  } catch (error) {
    next(ApiError(error.message))
  }
};

module.exports = {
  create,
  getAll,
  getOne,
};
