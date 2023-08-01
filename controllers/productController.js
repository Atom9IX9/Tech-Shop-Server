const uuid = require("uuid");
const path = require("path");
const { Product } = require("../models");
const ApiError = require("../err/ApiError");

const create = async (req, res, next) => {
  try {
    const { title, price, categoryId } = req.body;
    const { img } = req.files;
    let fileName = uuid.v4() + ".jpg";

    const product = await Product.create({ title, price, categoryId, img: fileName });
    
    img.mv(path.resolve(__dirname, "..", "static", fileName));
    return res.json(product);
  } catch (error) {
    next(ApiError.incorrectRequest(error.message))
  }
};
const getAll = async (req, res) => {};
const getOne = async (req, res) => {};

module.exports = {
  create,
  getAll,
  getOne,
};
