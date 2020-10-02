const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const {users, urlDatabase} = require("./db/databases");
const {generateRandomString, getUserByEmail, urlsForUser, getUserID} = require('./helpers');

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

////////////////////////////////////////////////////////////


app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/', (req, res) => {
  const userID = req.session['user_id'];
  if (users[userID]) {
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});

////////////////////////////////////////////////////////
//  REGISTER ROUTES
////////////////////////////////////////////////////////


//// GET request route for register page
app.get('/register', (req, res) => {
  const user = users[getUserID(req)];
  // If already logged in, redirect to urls page
  if (user) {
    res.redirect('urls');
  } else {
    const templateVars = {
      user,
      error: null
    };
    res.render('urls_register', templateVars);
  }
});

//// POST request route to register new user
app.post('/register', (req, res) => {
  const randomID = generateRandomString();
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = users[getUserID(req)];
  const templateVars = {
    user
  };
  
  // If input fields are empty
  if (email === '' || password === '') {
    res.status(400);
    templateVars.error = 'Failed Registration Attempt!';
    return res.render('urls_register', templateVars);
  
    // If email is already in database
  } else if (getUserByEmail(users, email)) {
    res.status(400);
    templateVars.error = 'Email Already in Use!';
    return res.render('urls_register', templateVars);

  } else {
    users[randomID] = {
      email,
      password: hashedPassword,
      id: randomID
    };

    req.session['user_id'] = randomID;
    res.redirect('urls');
  }
});


////////////////////////////////////////////////////////
//  LOGIN / LOGOUT ROUTES
////////////////////////////////////////////////////////

//// GET request route for login page
app.get('/login', (req, res) => {
  const user = users[getUserID(req)];
  // If already logged in
  if (user) {
    res.redirect('urls');
  } else {
    const templateVars = {
      user,
      error: null
    };
    res.render('urls_login', templateVars);
  }
});

//// POST request route to login
app.post('/login', (req, res) => {
  const user = users[getUserID(req)];
  const {email, password} = req.body;
  const templateVars = {
    user,
    error: 'Failed Login Attempt!'
  };
  // Check email and password against user database for login
  if (getUserByEmail(users, email) !== null) {
    const currentUser = getUserByEmail(users, email);
    if (bcrypt.compareSync(password, users[currentUser].password)) {
      req.session['user_id'] = currentUser;
      return res.redirect('urls');
    }
  }
  res.status(403);
  res.render('urls_login', templateVars);
});

//// POST request route to logout
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('urls');
});


////////////////////////////////////////////////////////
//  URL ROUTES
////////////////////////////////////////////////////////

//// GET request route to show all URL page
app.get('/urls', (req, res) => {
  const user = users[getUserID(req)];
  const templateVars = {
    user,
    urls: urlsForUser(urlDatabase, getUserID(req))
  };
  res.render('urls_index', templateVars);
});

//// POST request route to add new URL
app.post('/urls', (req, res) => {
  const userID = req.session['user_id'];
  // If not logged in
  if (!users[userID]) {
    res.status(403);
    res.send('You must be logged in to create URLs!');
  } else {
    let id = generateRandomString();
    urlDatabase[id] = {
      longURL: `http://${req.body.longURL}`,
      userID,
    };
    res.redirect(`urls/${id}`);
  }
});

//// GET request route to add new URL page
app.get('/urls/new', (req, res) => {
  const userID = req.session['user_id'];
  // Only able to render if logged in
  if (users[userID]) {
    const user = users[userID];
    const templateVars = {
      user
    };
    res.render('urls_new', templateVars);
  } else {
    res.redirect('login');
  }
});

//// POST request route to delete URL
app.post('/urls/:shortURL/delete', (req, res) => {
  const userID = req.session['user_id'];
  const shortURL = req.params.shortURL;
  // Only deletes URL if included in user's URL list
  if (urlDatabase[shortURL].userID === userID) {
    delete urlDatabase[shortURL];
    res.redirect('/urls');
  } else {
    res.status(403);
    res.send('This is not your URL to delete!');
  }
});

//// GET request route to show each URL
app.get('/urls/:shortURL', (req, res) => {
  const user = users[getUserID(req)];
  const shortURL = req.params.shortURL;
  // If url is in url database
  if (urlDatabase[shortURL]) {
    const templateVars = {
      user,
      shortURL,
      longURL: urlDatabase[shortURL].longURL,
      url: Object.keys(urlsForUser(urlDatabase, getUserID(req)))
    };
    res.render('urls_show', templateVars);
  } else {
    // Else will show error
    const templateVars = {
      user,
      shortURL: {},
      longURL: {},
      url: []
    };
    res.render('urls_show', templateVars);
  }
});

//// POST request route to edit URL
app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  const userID = req.session['user_id'];
  // If url belongs to the user
  if (urlDatabase[shortURL].userID === userID) {
    urlDatabase[shortURL] = {longURL: `http://${longURL}`, userID: userID};
    res.redirect('/urls');
  } else {
    res.status(403);
    res.send('This is not your URL to edit!');
  }
});

//// GET request route to redirect to long URL
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  // If url is not in url database
  if (!urlDatabase[shortURL]) {
    res.status(404);
    return res.send('URL cannot be found!');
  }

  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});