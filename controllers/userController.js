const ApiError = require("../err/ApiError");
const { User, Basket } = require("../models");

require("dotenv").config();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const generateJwt = (id, email, role, name, surname) => {
  return jsonwebtoken.sign(
    { id: id, email, role, name, surname },
    process.env.DEV_KEY,
    { expiresIn: "24h" }
  );
};

const signUp = async (req, res, next) => {
  try {
    const { email, password, role, name, surname, phoneNumber } = req.body;
    if (!email || !password) {
      return next(ApiError.incorrectRequest("enter_email_or_password"));
    }

    const isExistUser = await User.findOne({ where: { email } });
    if (isExistUser) {
      return next(ApiError.forbidden("user_already_exists"));
    }

    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      email,
      role,
      password: hashPassword,
      name,
      surname,
      phoneNumber,
    });
    const basket = await Basket.create({ userId: user.id });
    const token = generateJwt(user.id, email, role, name, surname);
    return res.json({
      token,
      user: jsonwebtoken.verify(token, process.env.DEV_KEY),
    });
  } catch (error) {
    return next(ApiError.incorrectRequest(error.message));
  }
};
const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.forbidden("incorrect_email_or_password"));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.forbidden("incorrect_email_or_password"));
    }
    const token = generateJwt(
      user.id,
      email,
      user.role,
      user.name,
      user.surname
    );
    return res.json({
      token,
      user: jsonwebtoken.verify(token, process.env.DEV_KEY),
    });
  } catch (error) {
    next(ApiError.incorrectRequest(error.message));
  }
};
const check = async (req, res, next) => {
  try {
    const token = generateJwt(req.user.id, req.user.email, req.user.role);
    res.json({ token, user: req.user });
  } catch (error) {
    next(ApiError.incorrectRequest(error.message));
  }
};

module.exports = {
  signIn,
  signUp,
  check,
};
