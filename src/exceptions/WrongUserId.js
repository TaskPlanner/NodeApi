const Exception = require("./Exception");

class WrongUserId extends Exception {
  constructor() {
    super(403, "If you want add an element, you should post your id");
  }
}

module.exports = WrongUserId;
