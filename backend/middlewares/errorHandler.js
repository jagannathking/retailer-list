const { ZodError } = require('zod');
const AppError = require('../utils/AppError');

const handleZodError = (err) => {
    const errors = err.errors.map(el => ({ field: el.path.join('.'), message: el.message }));
    return new AppError('Invalid input data.', 400, errors);
};

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};


const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      details: err.details,
    });
  // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
      details: null
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message; // Need to copy message explicitly

  if (error instanceof ZodError) error = handleZodError(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error); // Mongoose duplicate key
  if (error.name === 'CastError') error = handleCastErrorDB(error); // Mongoose cast error

  // For now, send detailed errors always. In production, distinguish.
  // sendErrorProd(error, res);
   res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      details: error.details || (error instanceof ZodError ? error.errors : null), // Keep Zod details
      // stack: process.env.NODE_ENV === 'development' ? error.stack : undefined // Optional stack trace in dev
    });
};