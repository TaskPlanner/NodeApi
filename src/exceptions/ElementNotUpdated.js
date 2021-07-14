const Exception = require("./Exception");

class ElementNotUpdated extends Exception {
  constructor() {
    super(
      400,
      "Element cannot be updated - probably invalid userId or elementId"
    );
  }
}

module.exports = ElementNotUpdated;
