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

function checkQueryParams(qParams, validOptions) {
  return new Promise((resolve, reject) => {
    if (!qParams) {
      resolve([]);
    } else {
      const pattern = /^([a-z]+\,?)+[a-z]+$/i;
      const match = pattern.test(qParams);

      if (match) {
        if (validOptions) {
          validOptions = new RegExp(`^${validOptions.join("$|^")}$`);

          const incorrect = qParams.split(",").find(qp => !validOptions.test(qp))

          if (!incorrect) {
            resolve(qParams.split(","))
          } else {
            reject("one of the given params isn't correct or doesn't exist")
          }
        } else {
          resolve(qParams.split(","))
        }
      } else {
        reject("something is wrong with the query")
      }
    }
  })
}

app.get("/", async (req, res) => {
  const validGenres = ["humor", "sport", "stripverhaal"];
  let allWords, allGenres;

  try {
    allWords = await checkQueryParams(req.query.words);
    allGenres = await checkQueryParams(req.query.genres, validGenres);
  } catch (err) {
    // The given query isn't correct, do something
    return console.log(err)
  }


  res.render("index.ejs", {
    words: allWords,
    genres: allGenres
  });
})

function strArrayParser(strArray, str) {
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

function strArrayRemover(strArray, str) {
  console.log(`String array: ${strArray}.`, `String: ${str}.`)
  return new Promise((resolve, reject) => {
    if (!strArray && !str) {
      resolve([]);
    } else if (!str) {
      resolve(strArray.split(","));
    } else {
      const x = strArray.replace(new RegExp(`\,{1}${str}|${str}\,{1}|${str}`), "");

      (!x) ? resolve([]) : resolve(x.split(","));
    }
  });
}

app.post("/submitWord", async (req, res) => {
  const allWords = await strArrayParser(req.body.wordsBundle, req.body.dataWord);
  const allGenres = await strArrayParser(req.body.genresBundle, undefined);

  res.redirect(`/?words=${allWords.join(",")}&genres=${allGenres.join(",")}`)
})

app.post("/submitGenre", async (req, res) => {
  const allGenres = await strArrayParser(req.body.genresBundle, req.body.dataGenre);
  const allWords = await strArrayParser(req.body.wordsBundle, undefined);

  res.redirect(`/?words=${allWords.join(",")}&genres=${allGenres.join(",")}`)
})

app.post("/removeWord", async (req, res) => {
  const allWords = await strArrayRemover(req.body.wordsBundle, req.body.dataWord)
  const allGenres = await strArrayRemover(req.body.genresBundle, undefined)

  res.redirect(`/?words=${allWords.join(",")}&genres=${allGenres.join(",")}`)
})

app.post("/removeGenre", async (req, res) => {
  const allGenres = await strArrayRemover(req.body.genresBundle, req.body.dataGenre);
  const allWords = await strArrayRemover(req.body.wordsBundle, undefined);

  res.redirect(`/?words=${allWords.join(",")}&genres=${allGenres.join(",")}`)
})

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
