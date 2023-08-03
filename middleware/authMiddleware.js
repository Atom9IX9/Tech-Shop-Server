const jsonwebtoken = require("jsonwebtoken")
require("dotenv").config();

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1] // bearer
    if (!token) {
      return res.status(401).json({ message: "without_authorization" });
    }
    const decoded = jsonwebtoken.verify(token, process.env.DEV_KEY)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: "without_authorization" });
  }
};
