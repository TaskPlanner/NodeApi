const express = require("express");
const WrongUserId = require("../exceptions/WrongUserId");
const ElementDoesNotExist = require("../exceptions/ElementDoesNotExist");
const ElementNotUpdated = require("../exceptions/ElementNotUpdated");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

module.exports = class ElementController {
  constructor() {
    this.path = "/elements";
    this.router = express.Router();

    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}`, this.getUserElements);
    this.router.post(`${this.path}`, this.addElement);

    this.router.get(`${this.path}/:elementId`, this.getElement);
    this.router.put(`${this.path}/:elementId`, this.updateElement);
    this.router.delete(`${this.path}/:elementId`, this.deleteElement);
  }

  getAuthenticatedUserId = async (req, res) => {
    // console.log(req.session);
    // console.log(req._passport);
    // console.log(req.session.cookie);
    return new Promise((resolve, reject) => {
      ensureAuthenticated(req, res, async (err) => {
        if (err) {
          reject(err);
        } else {
          const user = req.session.passport.user;
          resolve(this.repository.findUserByUsername(user));
        }
      });
    });
  }

  getUserElements = async (req, res, next) => {
    this.getAuthenticatedUserId(req, res)
      .then((userId) => {
        this.repository.findElementByUserId(userId)
          .then((results) => {
            //console.log(results);
            res.send(results);
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  }

  addElement = async (req, res, next) => {
    this.getAuthenticatedUserId(req, res)
      .then((userId) => {
        if (userId != req.body.userId) {
          next(new WrongUserId());
        } else {
          this.repository.addElement(req.body, (err, element) => {
            if (err) {
              next(err);
            } else {
              res.send(element);
            }
          });
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  getElement = async (req, res, next) => {
    this.getAuthenticatedUserId(req, res)
      .then((userId) => {
        this.repository.findOneElement({_id: req.params.elementId, userId: userId})
          .then((result) => {
            if (!result) {
                next(new ElementDoesNotExist());
            } else {
              res.send(result);
            }
          });
      })
      .catch((err) => {
        next(err);
      });
  }

  updateElement = async (req, res, next) => {
    this.getAuthenticatedUserId(req, res)
    .then((userId) => {
      this.repository.findOneElementAndUpdate(
        {_id: req.params.elementId, userId: userId},
        req.body,
        {new: true}
      )
        .then((updatedElement) => {
          //console.log(updatedElement);
          if (updatedElement) {
            res.send(updatedElement);
          } else {
            next(new ElementNotUpdated());
          }
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  deleteElement = async (req, res, next) => {
    this.getAuthenticatedUserId(req, res)
    .then((userId) => {
      this.repository.findOneElementAndDelete(
        {_id: req.params.elementId, userId: userId}
      )
        .then((result) => {
          if (!result) {
            next(new ElementDoesNotExist());
          } else {
              res.sendStatus(200);
          }
        });
    })
    .catch((err) => {
      next(err);
    });
  }

  setRepository(repo) {
    this.repository = repo;
  }
};
