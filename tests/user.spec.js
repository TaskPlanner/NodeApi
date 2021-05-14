const request = require("supertest");
const expect = require("chai").expect;

const App = require("../src/App");
const UserController = require("../src/users/userController");
const mongo = require("../src/database/MongoRepository");
const app = new App(new mongo(), [new UserController()]);

describe("test users functionality", () => {
  const testUser = {
    username: "testUsername",
    password: "testPassword",
  };

  it("should reject get request to page with login users access only", (done) => {
    request(app.app)
      .get("/users")
      .expect(401)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        expect(res.body.errorMessage).to.not.be.undefined;
        expect(res.body).to.deep.equal({
          errorMessage: "You should login to access this page",
        });
        done();
      });
  });

  it("should register user and respond with 201 status code", (done) => {
    request(app.app)
      .post("/users/register")
      .send(testUser)
      .expect(201)
      .end((err, res) => {
        // this will catch another status code fails
        if (err) {
          return done(err);
        }
        app.repository
          .getAllUsers()
          .then((users) => {
            expect(users[0].username).to.equal(testUser.username);
            done();
          })
          .catch(done);
      });
  });

  it("should login registered user", (done) => {
    request(app.app)
      .post("/users/login")
      .send(testUser)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        done();
      });
  });
});
