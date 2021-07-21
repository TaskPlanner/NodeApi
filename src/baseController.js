const ensureAuthenticated = require("./middlewares/ensureAuthenticated");
const WrongUserId = require("./exceptions/WrongUserId");
const ObjectNotExist = require("./exceptions/ObjectNotExist");
const ObjectNotUpdated = require("./exceptions/ObjectNotUpdated");

module.exports = class BaseController {
  constructor(type, name, reqParamNames) {
    this.type = type;
    this.name = name;
    this.reqParamNames = reqParamNames;
  }

  getAuthenticatedUserId = async (req, res) => {
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
  };

  getAll = async (req, res, next) => {
    this.getAuthenticatedUserId(req, res)
      .then((userId) => {
        this.repository
          .findAllByUserId(this.type, userId)
          .then((results) => {
            res.send(results);
          })
          .catch(next);
      })
      .catch(next);
  };

  addOne = async (req, res, next) => {
    this.getAuthenticatedUserId(req, res)
      .then((userId) => {
        if (userId != req.body.userId) {
          next(new WrongUserId());
        } else {
          this.repository.addOne(this.type, req.body, (err, object) => {
            if (err) {
              next(err);
            } else {
              res.send(object);
            }
          });
        }
      })
      .catch(next);
  };

  getOne = async (req, res, next) => {
    this.getAuthenticatedUserId(req, res)
      .then((userId) => {
        this.repository
          .findOne(this.type, {
            _id: req.params[this.reqParamNames.id],
            userId: userId,
          })
          .then((result) => {
            if (!result) {
              next(new ObjectNotExist(this.name));
            } else {
              res.send(result);
            }
          });
      })
      .catch(next);
  };

  updateOne = async (req, res, next) => {
    this.getAuthenticatedUserId(req, res)
      .then((userId) => {
        this.repository
          .findOneAndUpdate(
            this.type,
            { _id: req.params[this.reqParamNames.id], userId: userId },
            req.body,
            { new: true }
          )
          .then((updated) => {
            if (updated) {
              res.send(updated);
            } else {
              next(new ObjectNotUpdated(this.name));
            }
          });
      })
      .catch(next);
  };

  deleteOne = async (req, res, next) => {
    this.getAuthenticatedUserId(req, res)
      .then((userId) => {
        this.repository
          .findOneAndDelete(this.type, {
            _id: req.params[this.reqParamNames.id],
            userId: userId,
          })
          .then((result) => {
            if (!result) {
              next(new ObjectNotExist(this.name));
            } else {
              res.sendStatus(200);
            }
          });
      })
      .catch(next);
  };

  setRepository(repo) {
    this.repository = repo;
  }
};
