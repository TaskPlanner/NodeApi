const Exception = require("./Exception");

class ElementDoesNotExist extends Exception {
  constructor() {
    super(404, "This element does not exist");
  }
}

module.exports = ElementDoesNotExist;
