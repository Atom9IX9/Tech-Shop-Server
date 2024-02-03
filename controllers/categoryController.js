const ApiError = require("../err/ApiError");
const { Category } = require("../models/index");
const uuid = require("uuid");
const path = require("path");

const create = async (req, res, next) => {
  try {
    const { icon } = req.files;
    const { en, ua, ru } = req.body;
    const code = en.toLowerCase().split(" ").join("_");
    let fileName = code + ".jpg";

    const category = await Category.create({
      en,
      ua,
      ru,
      code,
      icon: fileName,
    });

    icon.mv(path.resolve(__dirname, "..", "static", fileName));
    return res.json(category);
  } catch (error) {
    return next(ApiError.incorrectRequest(error.message));
  }
};

const getAll = async (req, res) => {
  const categories = await Category.findAll();

  res.json(categories);
};

const removeCategory = async (req, res, next) => {
  try {
    const { code } = req.params;

    if (!code) {
      return next(ApiError.incorrectRequest("category's code is required"));
    }

    const deletedCategory = await Category.destroy({
      where: { code },
    });

    return res.json({ deleted: !!deletedCategory });
  } catch (error) {
    return next(ApiError.incorrectRequest(error.message));
  }
};

module.exports = {
  create,
  getAll,
  removeCategory,
};
