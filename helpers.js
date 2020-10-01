function generateRandomString() {
  let randomString = Math.random().toString(36).substring(2,8);
  return randomString;
};

const getUserByEmail = (userDatabase, email) => {
  for (const user in userDatabase) {
    const currentUser = userDatabase[user];
    if (currentUser.email === email) {
      return user;
    }
  }
  return null;
};

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

module.exports = {generateRandomString, getUserByEmail, urlsForUser};