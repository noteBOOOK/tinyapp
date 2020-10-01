function generateRandomString() {
  let randomString = Math.random().toString(36).substring(2,8);
  return randomString;
};

const checkEmail = (userDatabase, email) => {
  for (const user in userDatabase) {
    const currentUser = userDatabase[user];
    if (currentUser.email === email) {
      return true;
    }
  }
  return null;
};

const checkPassword = (userDatabase, email, password) => {
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

const urlsForUser = (urlDatabase, user) => {
  const result = {};
  for (const url in urlDatabase) {
    const currentURL = urlDatabase[url];
    if (currentURL.userID === user) {
      result[url] = {longURL: currentURL.longURL}
    }
  }
  return result;
};

module.exports = {generateRandomString, checkEmail, checkPassword, urlsForUser};