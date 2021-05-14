const mongoose = require("mongoose");
const userDocument = require("../models/userModel");
const elementDocument = require("../models/elementModel");
const UserDoesNotExist = require("../exceptions/UserDoesNotExist");

class MongoRepository {
  constructor() {
    this.connectToRemoteDatabase();
  }

  connectToRemoteDatabase() {
    mongoose
      .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
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
      (err, user) => {
        callback(err);
      }
    );
  }

  findUserByUsername = async (username) => {
    return userDocument.findOne({username: username})
      .then((result) => {
        if (!result) {
          throw new UserDoesNotExist();
        } else {
          //console.log(result);
          return result._id;
        }
      })
      .catch((err) => {
        throw err;
      });
  }

  findElementByUserId = async (userId) => elementDocument.find({userId: userId});

  addElement = async (element, callback) => elementDocument(element).save(callback);

  findOneElement = async (conditions) => elementDocument.findOne(conditions);

  findOneElementAndUpdate = async (conditions, element, options) => {
    return elementDocument.findOneAndUpdate(conditions, element, options);
  }

  findOneElementAndDelete = async (conditions) => {
    return elementDocument.findOneAndDelete(conditions);
  }

}

module.exports = MongoRepository;
