const express = require("express");
const dotenv = require("dotenv/config");
const errorMiddleware = require("./middlewares/errorMiddleware");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const fs = require('fs');
const https = require('https');

class App {
  constructor(repo, controllers) {
    this.app = express();
    this.repository = repo;
    this.setPortNumber();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  setPortNumber() {
    this.port = parseInt(process.env.PORT);
  }

  initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(cors({
      origin: true, // true means that any origin is allowed, if we deploy application on server it should be changed to specific origin
      methods: ['GET', 'PUT', 'POST', 'DELETE'],
      credentials: true,
    }));

    this.app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false, // if true forces the session to be saved back to the session store, even if the session was never modified during the request
        saveUninitialized: true, // forces a session that is “uninitialized” to be saved to the store. A session is uninitialized when it is new but not modified
        cookie: {
          sameSite: "none",
          secure: true,
        },
        // it's possible to store sessions in the database, but it's opional (idk what is default store)
        // reqiures import const MongoStore = require('connect-mongo');
        // store: MongoStore.create({
        //   mongoUrl: process.env.DATABASE_URL,
        // }),
      })
    );
    
    this.app.use(passport.initialize());
    this.app.use(passport.session());

    const userAuthentication = this.repository.getAuthenticationFunctions();
    
    passport.use(new LocalStrategy(userAuthentication.authenticate()));
    passport.serializeUser(userAuthentication.serializeUser());
    passport.deserializeUser(userAuthentication.deserializeUser());
}
        
  initializeControllers(controllers) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
      controller.setRepository(this.repository);
    });
  }

  initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  listen() {
    https.createServer({
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.cert')
    }, this.app)
    .listen(this.port, () => {
      console.log(`app listening on the port ${this.port}`);
    });
  }
}

module.exports = App;
