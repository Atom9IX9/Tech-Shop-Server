const ApiError = require("../err/ApiError");
const { User, Basket } = require("../models");

require("dotenv").config();
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const generateJwt = (id, email, role, name, surname, rememberMe = false) => {
  return jsonwebtoken.sign(
    { id: id, email, role, name, surname },
    process.env.DEV_KEY,
    { expiresIn: rememberMe ? "31d" : "10h" }
  );
};

const signUp = async (req, res, next) => {
  try {
    const { email, password, role, name, surname, phoneNumber } = req.body;
    if (!email || !password) {
      return next(ApiError.incorrectRequest("enter_email_or_password"));
    }

    const isExistEmail = await User.findOne({ where: { email } });
    if (isExistEmail) {
      return next(
        ApiError.forbidden("email_already_exists", { field: "email" })
      );
    }
    const isExistPhoneNumber = await User.findOne({ where: { phoneNumber } });
    if (isExistPhoneNumber) {
      return next(
        ApiError.forbidden("phone_number_already_exists", {
          field: "phoneNumber",
        })
      );
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
    const token = generateJwt(user.id, email, user.role, name, surname);
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
    const { email, password, rememberMe } = req.body;
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
      user.surname,
      rememberMe
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
    const checkUser = await User.findOne({where: {id: req.user.id}})
    res.json({...req.user, role: checkUser.role});
  } catch (error) {
    next(ApiError.incorrectRequest(error.message));
  }
};

module.exports = {
  signIn,
  signUp,
  check,
};
