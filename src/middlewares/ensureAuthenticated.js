const UserNotAuthenticated = require("../exceptions/UserNotAuthenticated");

const ensureAuthenticated = async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    next(new UserNotAuthenticated());
  }
};

module.exports = ensureAuthenticated;
