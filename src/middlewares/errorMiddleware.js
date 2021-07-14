// eslint-disable-next-line no-unused-vars
const errorMiddleware = (error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";

  res.status(status).json({ errorMessage: message }).end();
};

module.exports = errorMiddleware;
