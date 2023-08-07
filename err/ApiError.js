class ApiError extends Error {
  constructor(status, message, info) {
    super()
    this.status = status
    this.message = message
    this.info = info
  }

  static incorrectRequest(message, info) {
    return new ApiError(404, message, info)
  }

  static internal(message, info) {
    return new ApiError(500, message, info)
  }

  static forbidden(message, info) {
    return new ApiError(403, message, info)
  }
}

module.exports = ApiError