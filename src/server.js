const App = require("./App");
const UserController = require("./users/userController");
const ElementController = require("./elements/elementController");
const MongoDb = require("./database/MongoRepository");

const controllers = [new UserController(), new ElementController()];
const repository = new MongoDb();

const app = new App(repository, controllers); // here we should add new controllers

app.listen();
