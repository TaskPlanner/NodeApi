const BaseController = require("../baseController");
const express = require("express");

module.exports = class ElementController extends BaseController {
  constructor() {
    super("elements", "element", { id: "elementId" });

    this.path = "/elements";
    this.router = express.Router();

    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.route(this.path).get(this.getAll).post(this.addOne);

    this.router
      .route(`${this.path}/:elementId`)
      .get(this.getOne)
      .put(this.updateOne)
      .delete(this.deleteOne);
  }
};
