const App = require("./App");
const UserController = require("./users/userController");
const ElementController = require("./elements/elementController");
const ProjectController = require("./projects/projectController");
const MongoDb = require("./database/MongoRepository");

// here we should add new controllers
const controllers = [
  new UserController(),
  new ElementController(),
  new ProjectController(),
];
const repository = new MongoDb();

const app = new App(repository, controllers);

app.listen();
