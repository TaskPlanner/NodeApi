const Exception = require("./Exception");

class DoesNotExistException extends Exception {
  constructor(objectName) {
    super(404, `This ${objectName} does not exist`);
  }
}

module.exports = DoesNotExistException;
