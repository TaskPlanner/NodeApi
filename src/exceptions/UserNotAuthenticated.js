const Exception = require("./Exception");

class UserNotAuthenticated extends Exception {
  constructor() {
    super(401, "You should login to access this page");
  }
}

module.exports = UserNotAuthenticated;
