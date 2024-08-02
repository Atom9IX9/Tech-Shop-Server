const ApiError = require("../err/ApiError");
const {
  Category,
  Subcategory,
  ProductSubcategory,
} = require("../models/index");
const uuid = require("uuid");
const path = require("path");
const { Op } = require("sequelize");

const create = async (req, res, next) => {
  try {
    const { icon } = req.files;
    const { en, ua, ru } = req.body;
    const code = en
      .toLowerCase()
      .replace(/ /gi, "_")
      .replace(/[^A-Za-z0-9_]/gi, "");
      
    let fileName = uuid.v4() + ".jpg";

    const category = await Category.create({
      en,
      ua,
      ru,
      code,
      icon: fileName,
    });

    icon.mv(path.resolve(__dirname, "..", "public", fileName));
    return res.json(category);
  } catch (error) {
    return next(ApiError.incorrectRequest(error.message));
  }
};

const createSubcategory = async (req, res, next) => {
  try {
    const { en, ua, ru, categoryCode, order } = req.body;
    const code = en
      .toLowerCase()
      .replace(/ /gi, "_")
      .replace(/[^A-Za-z0-9_]/gi, "");

    const subcategory = await Subcategory.create({
      en,
      ua,
      ru,
      code,
      order,
      categoryCode,
    });

    return res.json(subcategory);
  } catch (error) {
    return next(ApiError.incorrectRequest(error.message));
  }
};

const createProductSubcategory = async (req, res, next) => {
  try {
    const { productId, subcategoryCode } = req.body;
    const productSubcategory = await ProductSubcategory.create({
      productId,
      subcategoryCode,
    });
    return res.json(productSubcategory);
  } catch (error) {
    return next(ApiError.incorrectRequest(error.message));
  }
};

const getProductSubcategories = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const productSubcategories = await ProductSubcategory.findAll({
      where: { productId },
    });
    const productSubcategoriesCodes = productSubcategories.map(
      (ps) => ps.subcategoryCode
    );
    const subcategories = await Subcategory.findAll({
      where: {
        code: { [Op.in]: productSubcategoriesCodes },
      },
    });
    return res.json(subcategories);
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

const getSubcategoriesWithCategory = async (req, res, next) => {
  try {
    const { categoryCode, order } = req.params;

    const subcategories = await Subcategory.findAll({
      where: { categoryCode, order: order || 1 },
    });
    return res.json(subcategories);
  } catch (error) {
    return next(ApiError.incorrectRequest(error.message));
  }
};
module.exports = {
  create,
  getAll,
  removeCategory,
  createSubcategory,
  createProductSubcategory,
  getProductSubcategories,
  getSubcategoriesWithCategory,
};
