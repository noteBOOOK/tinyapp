const bcrypt = require('bcrypt');

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher", 10)
  }
};

const urlDatabase = {
  'b2xVn2': {longURL: "http://www.lighthouselabs.ca", userID: "userRandomID"},
  '9sm5xK': {longURL: "http://www.google.com", userID: "user2RandomID"}
};

module.exports = {users, urlDatabase};