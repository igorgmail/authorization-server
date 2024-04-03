class CustomError extends Error {
  constructor(message, statusCode, validatorErrors) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.validatorErrors = validatorErrors ?? [];
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
