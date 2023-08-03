const ApiError = require("../err/ApiError");
const { User, Basket } = require("../models");

require("dotenv").config();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const generateJwt = (id, email, role) => {
  return jsonwebtoken.sign(
    { id: id, email, role },
    process.env.DEV_KEY,
    { expiresIn: "24h" }
  )
}

const signUp = async (req, res, next) => {
  try {
    const { email, password, role, name, surname, phoneNumber } = req.body;
    if (!email || !password) {
      return next(ApiError.incorrectRequest("incorrect_email_or_password"));
    }

    const isExistUser = await User.findOne({ where: { email } });
    if (isExistUser) {
      next(ApiError.forbidden("user_already_exists"));
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
    const jwt = generateJwt(user.id, email, role);
    return res.json({ token: jwt });
  } catch (error) {
    next(ApiError.incorrectRequest(error.message));
  }
};
const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.forbidden("incorrect_email_or_password"))
    }
    let comparePassword = bcrypt.compareSync(password, user.password)
    if(!comparePassword) {
      return next(ApiError.forbidden("incorrect_email_or_password"))
    }
    const jwt = generateJwt(user.id, email, user.role)
    return res.json({token: jwt})
  } catch (error) {
    next(ApiError.incorrectRequest(error.message))
  }
};
const check = async (req, res, next) => {
  try {
    const jwt = generateJwt(req.user.id, req.user.email, req.user.role)
    res.json({token: jwt})
  } catch (error) {
    next(ApiError.incorrectRequest(error.message))
  }
};

module.exports = {
  signIn,
  signUp,
  check,
};
