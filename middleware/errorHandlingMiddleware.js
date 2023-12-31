const ApiError = require("../err/ApiError");

module.exports = function (err, req, res, next) {
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, info: err.info });
  }
  return res.status(500).json({ message: "new error" });
};
