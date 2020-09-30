function generateRandomString() {
  let randomString = Math.random().toString(36).substring(2,8);
  return randomString;
};

const checkEmail = function (userDatabase, email) {
  for (const user in userDatabase) {
    const currentUser = userDatabase[user];
    if (currentUser.email === email) {
      return true;
    }
  }
  return null;
};

const checkPassword = function (userDatabase, email, password) {
  let result = '';
  for (const user in userDatabase) {
    const currentUser = userDatabase[user];
    if (currentUser.email === email) {
      if (currentUser.password === password) {
        result = currentUser.id;
        return result;
      }
    }
  }
  return null;
}

module.exports = {generateRandomString, checkEmail, checkPassword};