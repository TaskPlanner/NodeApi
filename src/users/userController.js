const express = require("express");
const passport = require("passport");
const WrongUsernameOrPassword = require("../exceptions/WrongUsernameOrPassword");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

module.exports = class UserController {
  constructor() {
    this.path = "/users";
    this.router = express.Router();

    this.initializeRoutes();
  }

  setRepository(repo) {
    this.repository = repo;
  }

  initializeRoutes() {
    this.router.get(this.path, ensureAuthenticated, async (req, res) => {
      res.json({ response: "ok" });
    });
    this.router.post(`${this.path}/login`, this.login);
    this.router.post(`${this.path}/logout`, this.logout);
    this.router.post(`${this.path}/register`, this.register);
  }

  login = async (req, res, next) => {
    // eslint-disable-next-line no-unused-vars
    passport.authenticate("local", (err, user, info) => {
      // console.log(user);
      // console.log(info);
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new WrongUsernameOrPassword());
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.send(user);
      });
    })(req, res, next);
  };

  logout = async (req, res) => {
    req.logout();
    res.sendStatus(200);
  };

  register = async (req, res, next) => {
    const callback = (err) => {
      if (err) {
        next(err);
      } else {
        passport.authenticate("local")(req, res, () => {
          res.sendStatus(201);
        });
      }
    };
    await this.repository.registerUser(
      req.body.username,
      req.body.password,
      callback
    );
  };
};
