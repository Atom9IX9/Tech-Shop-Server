const sequelize = require("../db");

const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
  name: { type: DataTypes.STRING, allowNull: false },
  surname: { type: DataTypes.STRING, allowNull: false },
  phoneNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Rating = sequelize.define("rating", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rate: { type: DataTypes.INTEGER, allowNull: false },
});

const Like = sequelize.define("like", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
})

const Basket = sequelize.define("basket", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketProduct = sequelize.define("basket_product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Product = sequelize.define("product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  en: { type: DataTypes.STRING, unique: true },
  ua: { type: DataTypes.STRING, unique: true },
  ru: { type: DataTypes.STRING, unique: true },
  price: { type: DataTypes.INTEGER, allowNull: false },
  sale: { type: DataTypes.FLOAT, defaultValue: 0, allowNull: false },
  rating: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  img: { type: DataTypes.STRING, allowNull: false, unique: true },
});

const ProductInfo = sequelize.define("product_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

const Category = sequelize.define("category", {
  code: { type: DataTypes.STRING, unique: true, primaryKey: true },
  en: { type: DataTypes.STRING, unique: true, allowNull: false },
  ua: { type: DataTypes.STRING, unique: true, allowNull: false },
  ru: { type: DataTypes.STRING, unique: true, allowNull: false },
  icon: { type: DataTypes.STRING, allowNull: false },
});

const Subcategory = sequelize.define("subcategory", {
  code: { type: DataTypes.STRING, unique: true, primaryKey: true },
});

User.hasOne(Basket);
Basket.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

Basket.hasMany(BasketProduct);
BasketProduct.belongsTo(Basket);

Category.hasMany(Product);
Product.belongsTo(Category);

Product.hasMany(BasketProduct);
BasketProduct.belongsTo(Product);
Product.belongsTo(BasketProduct)

Product.hasMany(Rating);
Rating.belongsTo(Product);

Product.hasMany(ProductInfo);
ProductInfo.belongsTo(Product);

User.hasMany(Like)
Like.belongsTo(User)

Product.hasMany(Like)
Like.belongsTo(Product)

module.exports = {
  User,
  Basket,
  BasketProduct,
  Category,
  Product,
  ProductInfo,
  Rating,
  Like
};
