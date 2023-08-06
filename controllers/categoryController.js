const ApiError = require("../err/ApiError");
const { Category } = require("../models/index");

const create = async (req, res, next) => {
  try {
    const { en, ua, ru } = req.body;
    const code = en.toLowerCase().split(" ").join("_")
    const category = await Category.create({ en, ua, ru, code });
    return res.json(category);
  } catch (error) {
    return next(ApiError.incorrectRequest(error.message))
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
