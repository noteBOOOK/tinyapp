const { assert } = require("chai");

const { getUserByEmail } = require("../helpers.js");

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

