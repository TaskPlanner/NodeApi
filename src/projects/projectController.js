const BaseController = require("../baseController");
const express = require("express");

module.exports = class ProjectController extends BaseController {
  constructor() {
    super("projects", "project", { id: "projectId" });

    this.path = "/projects";
    this.router = express.Router();

    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.route(this.path).get(this.getAll).post(this.addOne);

    this.router
      .route(`${this.path}/:projectId`)
      .get(this.getOne)
      .put(this.updateOne)
      .delete(this.deleteOne);
  }
};
