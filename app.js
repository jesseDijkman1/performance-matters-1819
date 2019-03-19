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
    words: [],
    genres: []
  });
})

function strArrayParser(strArray, str) {
  console.log(`String array=${strArray || undefined}`, `Single string=${str||undefined}`)

  return new Promise((resolve, reject) => {
    if (!strArray && !str) {
      resolve([]);
    } else if (!str) {      // There's a strArray, but no str
      strArray = strArray.split(",");
      resolve(strArray);
    } else if (!strArray) { // There's a str but no strArray
      resolve([str]);
    } else {                // Both strArray and str exist
      strArray += `,${str}`;
      strArray = strArray.split(",");
      resolve(strArray);
    }
  })
}

app.post("/submitWord", async (req, res) => {
  const allWords = await strArrayParser(req.body.wordsBundle, req.body.dataWord);
  const allGenres = await strArrayParser(req.body.genresBundle, undefined);

  res.render("index.ejs", {
    words: allWords,
    genres: allGenres
  });
})

app.post("/submitGenre", async (req, res) => {
  const allGenres = await strArrayParser(req.body.genresBundle, req.body.dataGenre);
  const allWords = await strArrayParser(req.body.wordsBundle, undefined);

  res.render("index.ejs", {
    words: allWords,
    genres: allGenres
  });
})

// app.post("/submitGenre", async (req, res) => {
//   const singleGenre = req.body.dataGenre;
//   let all
// })

// app.post("/removeWord", (req, res) => {
//   const clickedWord = req.body.dataWord;
//   let allWords = req.body.wordsBundle;
//   let allGenres = req.body.genresBundle;
//
//   allWords = allWords.split(",");
//   allWords.splice(allWords.indexOf(clickedWord), 1);
//
//   res.render("index.ejs", {
//     words: allWords,
//     genres:
//   });
// })

// app.post("/submitGenre", (req, res) => {
//   const singleGenre = req.body.dataGenre;
//   let allGenres = req.body.genresBundle;
// })

app.post("/results", (req, res) => renderList(res))
app.get("/results", (req, res) => renderList(res))

function renderList(res) {
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
}
app.listen(port, () => console.log(`Listening to port: ${port}!`))
