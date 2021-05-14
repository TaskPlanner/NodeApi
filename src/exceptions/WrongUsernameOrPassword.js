const Exception = require("./Exception");

class WrongUsernameOrPassword extends Exception {
  constructor() {
    super(401, "Incorrect username or password.");
  }
}

module.exports = WrongUsernameOrPassword;
