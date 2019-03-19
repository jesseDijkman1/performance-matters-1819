"use strict";

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");
const parseString = require('xml2js').parseString;
const fs = require("fs");

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
  fs.readFile("public/data/temp.json", (err, data) => {
    let parsedData = JSON.parse(data);

    parsedData.aquabrowser.meta[0].totalPages = Math.ceil(parsedData.aquabrowser.meta[0].count / 20);

    res.render("list.ejs", {
      data: {
        meta: parsedData.aquabrowser.meta[0],
        results: parsedData.aquabrowser.results[0].result
      }
    });
  })
})

app.listen(port, () => console.log(`Listening to port: ${port}!`))
