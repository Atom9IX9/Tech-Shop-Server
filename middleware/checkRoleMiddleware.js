const jsonwebtoken = require("jsonwebtoken")
require("dotenv").config();

module.exports = (role) => (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1] // bearer
    if (!token) {
      return res.status(401).json({ message: "without_authorization" });
    }
    const decoded = jsonwebtoken.verify(token, process.env.DEV_KEY)
    if (decoded.role !== role) {
      return res.status(403).json({message: "no_access"})
    }
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: "without_authorization" });
  }
};
