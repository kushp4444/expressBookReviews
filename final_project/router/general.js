const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message:"User already exists!"})
    }
  }
  return res.status(404).json({message:"Unable to register user. Please enter a valid username/password"})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4))
});

public_users.get('/async-get-books', async function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    resolve(JSON.stringify(books,null,4));
  });
  getBooks.then((bookList) => res.send(bookList));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = parseInt(req.params.isbn)
  if (!books[isbn]) {
    return res.status(404).send("No book with that ISBN exists in our library")
  } else {
    res.send(books[isbn])
  }
 });

public_users.get('/async-isbn/:isbn', async function (req, res) {
  try {
    const isbn = parseInt(req.params.isbn);
    if (!books[isbn]) {
      return res.status(404).send("No book with that ISBN exists in our library");
    }
    res.send(books[isbn]);
  } catch (error) {
    res.status(500).send("An error occurred while retrieving the book");
  }
});

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  let booksByAuthor = []
  for (let [isbn, details] of Object.entries(books)) {
    if (details.author === author) {
      booksByAuthor.push(isbn);
      booksByAuthor.push(details);
    }
  }
  res.send(JSON.stringify(booksByAuthor,null,4))
});

public_users.get('/async-author/:author', async function (req, res) {
  try {
    const author = req.params.author
    let booksByAuthor = []
    for (let [isbn, details] of Object.entries(books)) {
      if (details.author === author) {
        booksByAuthor.push(isbn);
        booksByAuthor.push(details);
      }
    }
    res.send(JSON.stringify(booksByAuthor,null,4))
  } catch (error) {
    res.status(500).send("An error occurred while retrieving the book");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  let booksByTitle = []
  for (let [isbn, details] of Object.entries(books)) {
    if (details.title === title) {
      booksByTitle.push(isbn);
      booksByTitle.push(details);
    }
  }
  res.send(JSON.stringify(booksByTitle,null,4))
});

public_users.get('/async-title/:title', async function (req, res) {
  try {
    const title = req.params.title
    let booksByTitle = []
    for (let [isbn, details] of Object.entries(books)) {
      if (details.title === title) {
        booksByTitle.push(isbn);
        booksByTitle.push(details);
      }
    }
    res.send(JSON.stringify(booksByTitle,null,4))
  } catch (error) {
    res.status(500).send("An error occurred while retrieving the book");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const num = parseInt(req.params.isbn)
  let reviews = []
  if (num<1 || num>10) {
    return res.send("No book with that ISBN exists in our library")
  } else {
    reviews.push(books[num].reviews)
  }
  res.send(JSON.stringify(reviews,null,4))
});

module.exports.general = public_users;
