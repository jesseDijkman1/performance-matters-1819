"use strict";

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");
const parseString = require('xml2js').parseString;
const fs = require("fs");
// const API = require("oba-wrapper/node");

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

app.get("/", (req, res) => {
  res.render("index.ejs", {
    words: []
  });
})

app.get("/results", (req, res) => {
  res.send("Results page")
})

app.post("/submitWord", (req, res) => {
  const singleWord = req.body.dataWord;
  let allWords = req.body.wordsBundle;

  if (!allWords) {
    allWords = [];
    if (singleWord) {
      allWords.push(singleWord)
    }
  } else {
    allWords += `,${singleWord}`;
    allWords = allWords.split(",");
  }


  res.render("index.ejs", {
    words: allWords
  });
})

app.post("/removeWord", (req, res) => {
  const clickedWord = req.body.dataWord;
  let allWords = req.body.wordsBundle;

  allWords = allWords.split(",");
  allWords.splice(allWords.indexOf(clickedWord), 1);

  res.render("index.ejs", {
    words: allWords
  });
})

app.post("/getResults", (req, res) => {
  const queryBase = `https://zoeken.oba.nl/api/v1/search?authorization=${process.env.API_KEY}`;
  const queryDefaults = "&pagesize=20&refine=true";
  let page = "&page=1";
  let query;

  let words = req.body.wordsBundle || "a";
  // console.log("words", words, words.length)

  if (words.length > 1) {
    words = words.split(",");
    words = `&q=${words.join("+")}`;
  } else {
    words = `&q=${words}`
  }

  query = queryBase + words + queryDefaults + page;

  request(query, (error, response, body) => {
    parseString(body, (err, result) => {
      result.aquabrowser.meta[0].totalPages = Math.ceil(result.aquabrowser.meta[0].count / 20);

      let data = {
        meta: result.aquabrowser.meta[0],
        results: result.aquabrowser.results[0].result
      }

      res.render("list.ejs", {
        data: data
      });
    });
  });
})

app.listen(port, () => console.log(`Listening to port: ${port}!`))
