const Exception = require("./Exception");

class UserDoesNotExist extends Exception {
  constructor() {
    super(401, "This user does not exist");
  }
}

module.exports = UserDoesNotExist;
