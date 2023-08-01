const sequelize = require("../db");

const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
  name: { type: DataTypes.STRING },
  surname: { type: DataTypes.STRING },
  phoneNumber: { type: DataTypes.STRING, unique: true },
});

const Rating = sequelize.define("rating", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rate: { type: DataTypes.INTEGER, allowNull: false },
});

const Basket = sequelize.define("basket", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketProduct = sequelize.define("basket_product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Product = sequelize.define("product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, unique: true },
  price: { type: DataTypes.INTEGER, allowNull: false },
  sale: { type: DataTypes.FLOAT },
  rating: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
  img: { type: DataTypes.STRING, allowNull: false, unique: true },
});

const ProductInfo = sequelize.define("product_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

const Category = sequelize.define("category", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  code: { type: DataTypes.STRING, unique: true, allowNull: false },
});

User.hasOne(Basket);
Basket.belongsTo(User);
User.hasMany(Rating);
Rating.belongsTo(User);

Basket.hasMany(BasketProduct);
BasketProduct.belongsTo(Basket);

BasketProduct.hasOne(Product);
Product.belongsTo(BasketProduct);
Product.hasMany(Rating);
Product.hasMany(BasketProduct);
BasketProduct.belongsTo(Product);
Rating.belongsTo(Product);
Product.hasMany(ProductInfo);
ProductInfo.belongsTo(Product);

Category.hasMany(Product)
Product.belongsTo(Category)

module.exports = {
  User,
  Basket,
  BasketProduct,
  Category,
  Product,
  ProductInfo,
  Rating,
};
