const mongoose = require("mongoose");
const userDocument = require("../models/userModel");
const elementDocument = require("../models/elementModel");
const projectDocument = require("../models/projectModel");
const ObjectNotExist = require("../exceptions/ObjectNotExist");

class MongoRepository {
  constructor() {
    this.connectToRemoteDatabase();
    this.initializeDocuments();
  }

  connectToRemoteDatabase() {
    mongoose
      /* eslint-disable no-undef, no-console */
      .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      // eslint-disable-next-line no-unused-vars
      .then((data) => {})
      .catch((err) =>
        console.log(
          "Error while connecting to the database, error message: " + err
        )
      );

    const connection = mongoose.connection;
    connection.on("error", console.error.bind(console, "connection error: "));
    connection.once("open", () => {
      console.log(
        `connected to the database at URL: ${process.env.DATABASE_URL}`
        /* eslint-enable no-undef, no-console */
      );
    });
  }

  getAuthenticationFunctions() {
    return {
      authenticate: () => userDocument.authenticate(),
      serializeUser: () => userDocument.serializeUser(),
      deserializeUser: () => userDocument.deserializeUser(),
    };
  }

  async getAllUsers() {
    return userDocument.find();
  }

  async registerUser(name, password, callback) {
    userDocument.register(
      new userDocument({ username: name }),
      password,
      // eslint-disable-next-line no-unused-vars
      (err, user) => {
        callback(err);
      }
    );
  }

  findUserByUsername = async (username) => {
    return userDocument
      .findOne({ username: username })
      .then((result) => {
        if (!result) {
          throw new ObjectNotExist("user");
        } else {
          return result._id;
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  initializeDocuments = () => {
    this.elements = elementDocument;
  }

  findAllByUserId = async (type, userId) =>
    this[type].find({ userId: userId });

  addOne = async (type, object, callback) =>
    this[type](object).save(callback);

  findOne = async (type, conditions) => this[type].findOne(conditions);

  findOneAndUpdate = async (type, conditions, object, options) => {
    return this[type].findOneAndUpdate(conditions, object, options);
  };

  findOneAndDelete = async (type, conditions) => {
    return this[type].findOneAndDelete(conditions);
  };
}

module.exports = MongoRepository;
