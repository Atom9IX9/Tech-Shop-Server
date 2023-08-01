const { Category } = require("../models/index");

const create = async (req, res) => {
  const { code } = req.body;
  const category = await Category.create({ code });
  return res.json(category);
};

const getAll = async (req, res) => {
  const categories = await Category.findAll()

  res.json(categories)
}

module.exports = {
  create,
  getAll,
};
