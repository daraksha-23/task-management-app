const createHttpError = require('http-errors');

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.reduce((acc, issue) => {
      const field = issue.path.join('.');

      if (!acc[field]) {
        acc[field] = issue.message;
      }

      return acc;
    }, {});

    return next(
      createHttpError(422, {
        message: 'Validation failed',
        errors,
      })
    );
  }

  // Replace request body with validated + sanitized data
  req.body = result.data;

  next();
};

module.exports = validate;