require('dotenv').config();

const errorHandler = (err, req, res, next) => {
  console.error(err);
  const errStatusCode = err.statusCode || 500;
  const errMsg = err.message || 'Something went wrong';

  const errorData = {
    status: err.status,
    msg: errMsg,
    errors: {
      code: errStatusCode,
      message: errMsg,
      stack: process.env.NODE_ENV === 'development' ? err.stack : {},
      validatorErrors: err.validatorErrors,
    },
  };

  res.status(errStatusCode).json(
    // success: false,
    errorData,
  );
};

module.exports = errorHandler;
