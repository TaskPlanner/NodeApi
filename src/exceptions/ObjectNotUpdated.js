const Exception = require("./Exception");

class NotUpdatedException extends Exception {
  constructor(objectName) {
    super(
      400,
      `${objectName} cannot be updated - probably invalid userId or ${objectName}Id`
    );
  }
}

module.exports = NotUpdatedException;
