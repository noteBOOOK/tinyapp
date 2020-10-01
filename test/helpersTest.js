const { assert } = require("chai");

const { getUserByEmail, generateRandomString, urlsForUser } = require("../helpers.js");

const testUser = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const testURLS = {
  'b2xVn2': {longURL: "http://www.lighthouselabs.ca", userID:"userRandomID"},
  '9sm5xK': {longURL: "http://www.google.com", userID:"user2RandomID"}
};




describe("generateRandomString", function() {
  it("Should return a string", function() {
    const string = generateRandomString();
    const result = typeof string;
    const expectedOutput = "string";
    assert.equal(result, expectedOutput);
  });
  
  it("Should be 6 characters long", function() {
    const string = generateRandomString();
    assert.equal(string.length, 6);
  });
});


describe("getUserByEmail", function() {
  it("Should return a user with valid email", function() {
    const user = getUserByEmail(testUser, "user@example.com");
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });
  
  it("Should return user2 with valid email", function() {
    const user = getUserByEmail(testUser, "user2@example.com");
    const expectedOutput = "user2RandomID";
    assert.equal(user, expectedOutput);
  });
  
  it("Should return null with invalid email", function() {
    const user = getUserByEmail(testUser, "hello@hello.com");
    const expectedOutput = null;
    assert.equal(user, expectedOutput);
  });
});


describe("urlsForUser", function() {
  it("Should return URL object for user of the URL", function() {
    const result = urlsForUser(testURLS, "userRandomID");
    const expectedOutput = {'b2xVn2': {longURL: "http://www.lighthouselabs.ca"}};
    assert.deepEqual(result, expectedOutput);
  });

  it("Should return URL object for other user", function() {
    const result = urlsForUser(testURLS, "user2RandomID");
    const expectedOutput = {'9sm5xK': {longURL: "http://www.google.com"}};
    assert.deepEqual(result, expectedOutput);
  });

  it("Should return an empty object if not a user", function() {
    const result = urlsForUser(testURLS, "hello");
    const expectedOutput = {};
    assert.deepEqual(result, expectedOutput);
  });
});