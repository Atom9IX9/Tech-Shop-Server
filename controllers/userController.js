const ApiError = require("../err/ApiError")

const signUp = async (req, res) => {}
const signIn = async (req, res) => {}
const check = async (req, res, next) => {
  const { id } = req.query
  if (!id) {
    return next(ApiError.incorrectRequest("ID not specified"))
  }
  return res.json(id)
}


module.exports = {
  signIn, signUp, check
}