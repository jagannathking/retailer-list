const AppError = require('../utils/AppError');

const validateRequest = (schema) => (req, res, next) => {
  try {
    if (schema.body) {
      req.body = schema.body.parse(req.body);
    }
    if (schema.query) {
      req.query = schema.query.parse(req.query);
    }
    if (schema.params) {
      req.params = schema.params.parse(req.params);
    }
    next();
  } catch (error) {
    // Let the global error handler catch ZodErrors
    next(error);
  }
};

module.exports = validateRequest;