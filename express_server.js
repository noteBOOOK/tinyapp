const express = require('express');
const app = express();
const PORT = 8080;
const {generateRandomString, checkEmail} = require('./helpers');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set('view engine', 'ejs');


const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher"
  }
};

const urlDatabase = {
  'b2xVn2': "http://www.lighthouselabs.ca",
  '9sm5xK': "http://www.google.com"
};
////////////////////////////////////////////////////////////


app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/register', (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users[userID];
  const templateVars = {
    user
  }
  res.render('urls_register', templateVars);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/urls', (req, res) => {
  const userID = req.cookies["user_id"];
  // console.log(userID);
  const user = users[userID];
  // console.log(user);
  const templateVars = { 
    user,
    urls: urlDatabase
  };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users[userID];
  const templateVars = { 
    user
  };
  res.render('urls_new', templateVars);
})

app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  if (longURL) {
    res.redirect(longURL);
  } else {
    res.send("")
  }
})

app.post('/register', (req, res) => {
  const randomID = generateRandomString();
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.status(400);
    res.send("Registration Failed: Please Try Again");
    return;
  } else if (checkEmail(users, email)) {
    res.status(400);
    res.send("Email Already in Use!")
  } else {
    users[randomID] = {
      email,
      password,
      id: randomID
    }
    res.cookie("user_id", randomID);
    console.log(users);
    res.redirect('/urls');
  }
})

app.post('/urls', (req, res) => {
  let id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls/${id}`);
})

app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
})

app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect('/urls');
})

app.post('/login', (req, res) => {
  console.log(req.body);
  res.cookie('user_id', req.body.userID);
  res.redirect('/urls');
})

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
})

app.get('/urls/:shortURL', (req, res) => {
  const userID = req.cookies["user_id"];
  const user = users[userID];
  const templateVars = { 
    user,
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]
  };
  res.render('urls_show', templateVars);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});