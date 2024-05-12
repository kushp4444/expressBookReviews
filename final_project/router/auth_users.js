const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username:"user1",password:"pwd1"},{username:"user2",password:"pwd2"}];

const isValid = (username)=>{ //returns boolean
  let userswithsamename = users.filter((user) => {
    return user.username === username
  })
  return (userswithsamename.length === 0)
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  return (validusers.length > 0)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Please enter a username and password"})
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60*60})

    req.session.authorization = {
      accessToken,username
    }
    res.send("User successfully logged in");
  } else {
    return res.status(401).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  if (!(req.session && req.session.authorization)) {
    return res.status(401).send('User not logged in');
  }
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(400).send("No book with that ISBN exists in our library")
  }
  const username = req.session.authorization.username;
  const review = req.query.review;
  books[isbn].reviews[username] = review;
res.send("Review successfully added!")
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  if (!(req.session && req.session.authorization)) {
    return res.status(401).send('User not logged in');
  }
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(400).send("No book with that ISBN exists in our library")
  }
  const username = req.session.authorization.username;
  
  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username]
    res.send("Review successfully deleted!")
  } else {
    res.status(404).send("No review found for this user on the specified book")
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;