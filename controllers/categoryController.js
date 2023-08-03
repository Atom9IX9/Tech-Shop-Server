const ApiError = require("../err/ApiError");
const { Category } = require("../models/index");

const create = async (req, res, next) => {
  try {
    const { code } = req.body;
    const category = await Category.create({ code });
    return res.json(category);
  } catch (error) {
    next(ApiError.incorrectRequest(error.message))
  }
};

const getAll = async (req, res) => {
  const categories = await Category.findAll();

  res.json(categories);
};

module.exports = {
  create,
  getAll,
};
