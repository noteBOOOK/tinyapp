const express = require('express');
const app = express();
const PORT = 8080;
const {generateRandomString, getUserByEmail, urlsForUser} = require('./helpers');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser'); //
const bcrypt = require('bcrypt');

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser()); //

app.set('view engine', 'ejs');


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
////////////////////////////////////////////////////////////



app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// GET request route for register page
app.get('/register', (req, res) => {
  const userID = req.session["user_id"];
  const user = users[userID];
  const templateVars = {
    user
  }
  res.render('urls_register', templateVars);
});

// GET request route for login page
app.get('/login', (req, res) => {
  const userID = req.session["user_id"];
  const user = users[userID];
  const templateVars = {
    user,
    error: null
  }
  res.render('urls_login', templateVars)
})

// GET request route to show all URL page
app.get('/urls', (req, res) => {
  const userID = req.session["user_id"];
  const user = users[userID];
  const templateVars = { 
    user,
    urls: urlsForUser(urlDatabase, userID)
  };
  res.render('urls_index', templateVars);
});

// GET request route to add new URL page
app.get('/urls/new', (req, res) => {
  const userID = req.session["user_id"];
  if (users[userID]) {
    const user = users[userID];
    const templateVars = { 
      user
    };
    res.render('urls_new', templateVars);
  } else {
    res.redirect('/login');
  }
})

// POST request route to register new user
app.post('/register', (req, res) => {
  const randomID = generateRandomString();
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (email === "" || password === "") {
    res.status(400);
    res.send("Registration Failed: Please Try Again");
    return;
  } else if (getUserByEmail(users, email)) {
    res.status(400);
    res.send("Email Already in Use!")
  } else {
    users[randomID] = {
      email,
      password: hashedPassword,
      id: randomID
    }
    req.session["user_id"] = randomID;
    console.log(users);
    res.redirect('/urls');
  }
})

// POST request route to add new URL
app.post('/urls', (req, res) => {
  let id = generateRandomString();
  const userID = req.session["user_id"];
  urlDatabase[id] = {
    longURL: req.body.longURL,
    userID,
  };
  res.redirect(`/urls/${id}`);
})

// POST request route to delete URL
app.post('/urls/:shortURL/delete', (req, res) => {
  const userID = req.session["user_id"];
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL].userID === userID) {
    delete urlDatabase[shortURL];
    res.redirect('/urls');
  } else {
    res.status(403);
    res.send("This is not your URL to delete!");
  }
})

// POST request route to edit URL
app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  const userID = req.session["user_id"];

  if (urlDatabase[shortURL].userID === userID) {
    urlDatabase[shortURL] = {longURL, userID: userID}
    res.redirect('/urls');
  } else {
    res.status(403);
    res.send("This is not your URL to edit!");
  }
})

// POST request route to login
app.post('/login', (req, res) => {
  const userID = req.session["user_id"];
  const user = users[userID];
  const {email, password} = req.body;
  const templateVars = {
    user,
    error: "Failed Login Attempt!"
  }
  if (getUserByEmail(users, email) !== null) {
    currentUser = getUserByEmail(users, email);
    if (bcrypt.compareSync(password, users[currentUser].password)) {
      req.session['user_id'] = currentUser;
      res.redirect('/urls');
    }
  } 
  res.status(403);
  res.render('urls_login', templateVars);
})

// POST request route to logout
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/urls');
})

// GET request route to redirect to long URL
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  if (longURL) {
    res.redirect(`http://${longURL}`);
  } else {
    res.send("")
  }
})

// GET request route to show each URL
app.get('/urls/:shortURL', (req, res) => {
  const userID = req.session["user_id"];
  const user = users[userID];
  const shortURL = req.params.shortURL;
  const templateVars = { 
    user,
    shortURL,
    longURL: urlDatabase[shortURL].longURL,
    url: Object.keys(urlsForUser(urlDatabase, userID))
  };
  res.render('urls_show', templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});