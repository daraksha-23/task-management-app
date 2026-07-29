const createHttpError = require('http-errors');

const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.issues.reduce((accumulator, issue) => {
        const field = issue.path.join('.') || source;

        if (!accumulator[field]) {
          accumulator[field] = issue.message;
        }
        return accumulator;
      }, {});

      return next(createHttpError(422, {message: 'Validation failed',errors,}));
    }
    req[source] = result.data;
    next();
  };
};

module.exports = validate;