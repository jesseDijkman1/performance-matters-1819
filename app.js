"use strict";

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");
const parseString = require('xml2js').parseString;


require('dotenv').config();

const port = 2000;


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static("public"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

let query;

class Query {
  constructor() {
    this.words = [];
    this.genres = [];
  }

  addWord(word) {
    this.words.push(word);
  }

  removeWord(word) {
    this.words.splice(this.words.indexOf(word), 1);
  }

  addGenre(genre) {
    this.genres.push(genre);
  }

  removeGenre(genre) {
    this.genres.splice(this.genres.indexOf(genre), 1);
  }
}

// First probably have to put this somewhere else so you can search multiple times
query = new Query();

app.get("/", (req, res) => res.render("index.ejs", {words: query.words, genres: query.genres}));

app.get("/search", (req, res) => {
  res.send("Search page");
})

app.get("/results", (req, res) => {
  res.send("Results page")
})

// Should be probably be in static js
app.post("/submitWord", (req, res) => {
  const word = req.body.dataWord;

  query.addWord(word);

  res.redirect("/")
  // res.render("index.ejs", {words: query.words, genres: query.genres})
})

app.post("/removeWord", (req, res) => {
  const word = req.body.dataWord;
  console.log(word, req.body)
  query.removeWord(word)

  res.redirect("/")
  // res.render("index.ejs", {words: query.words, genres: query.genres})
})

// Should be probably be in static js. Because now the page is loading
app.post("/submitGenre", (req, res) => {
  const genre = req.body.dataGenre;

  query.addGenre(genre);
  res.redirect("/")
  // res.render("index.ejs", {words: query.words, genres: query.genres})
})

app.post("/removeGenre", (req, res) => {
  const genre = req.body.dataGenre;

  query.removeGenre(genre)

  res.redirect("/")
  // res.render("index.ejs", {words: query.words, genres: query.genres})
})




app.listen(port, () => console.log(`Listening to port: ${port}!`))
