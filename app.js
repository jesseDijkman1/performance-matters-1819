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

// Temporary way to store the data as an Object
// let storage;

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

function makeQueryParams(params) {
  let q = [];

  params.forEach(p => {
    let key = Object.keys(p);
    let pData = p[key];

    if (pData.length) {
      q.push(`${key[0]}=${pData.join(",")}`);
    }
  })

  if (!q.join("&")) {
    return ""
  } else {
    return `?${q.join("&")}`
  }
}

app.get("/", (req, res) => {
  res.send("GOT TO <a href='/search'>search</a>")
})

app.get("/search", async (req, res) => {
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
    genres: [allGenres, validGenres],
    searchUrl: req._parsedUrl.search
  });
})

app.post("/submitWord", async (req, res) => {
  const allWords = await strArrayParser(req.body.wordsBundle, req.body.dataWord);
  const allGenres = await strArrayParser(req.body.genresBundle, undefined);
  const queryParams = makeQueryParams([{words:allWords}, {genres:allGenres}]);

  res.redirect(`/${queryParams}`)
})

app.post("/submitGenre", async (req, res) => {
  const allGenres = await strArrayParser(req.body.genresBundle, req.body.dataGenre);
  const allWords = await strArrayParser(req.body.wordsBundle, undefined);
  const queryParams = makeQueryParams([{words:allWords}, {genres:allGenres}]);

  res.redirect(`/${queryParams}`)
})

app.post("/removeWord", async (req, res) => {
  const allWords = await strArrayRemover(req.body.wordsBundle, req.body.dataWord)
  const allGenres = await strArrayRemover(req.body.genresBundle, undefined)
  const queryParams = makeQueryParams([{words:allWords}, {genres:allGenres}]);

  res.redirect(`/${queryParams}`)
})

app.post("/removeGenre", async (req, res) => {
  const allGenres = await strArrayRemover(req.body.genresBundle, req.body.dataGenre);
  const allWords = await strArrayRemover(req.body.wordsBundle, undefined);
  const queryParams = makeQueryParams([{words:allWords}, {genres:allGenres}]);

  res.redirect(`/${queryParams}`)
})



app.get("/results", (req, res) => {
  fs.readFile("public/data/temp.json", (err, data) => {
    let parsedData = JSON.parse(data);

    // storage = parsedData.aquabrowser.results[0].result;

    parsedData.aquabrowser.meta[0].totalPages = Math.ceil(parsedData.aquabrowser.meta[0].count / 20);

    res.render("list.ejs", {
      meta: parsedData.aquabrowser.meta[0],
      results: parsedData.aquabrowser.results[0].result,
      filters: req.query
    });
  })
})

function findObject(data, _id) {
  return new Promise((resolve, reject) => {
    const idRx = /(?<=\|)\d+/;

    data.find(obj => {
      const id = idRx.exec(obj.id[0]._)[0];

      if (id == _id) {
        resolve(obj)
      }
    })
  })
}

function fillInTheBlanks(data) {
  const template = {
    id: undefined,
    coverimages: undefined,
    titles: undefined,
    authors: undefined,
    formats: undefined,
    summaries: undefined,
    description: undefined
  }

  return new Promise((resolve, reject) => {
    console.log(data)
    for (let k in data) {

      console.log(k, data[k].length)
    }
  })
}

app.get("/detail/:id", (req, res) => {

  fs.readFile("public/data/temp.json", (err, data) => {
    const id = req.params.id;
    const parsedData = JSON.parse(data).aquabrowser.results[0].result;
    const detailData = findObject(parsedData, id).then(fillInTheBlanks);
    // console.log()
    // res.render("detail.ejs", detailData)
  })






  //d.id[0].$.nativeid
})

app.listen(port, () => console.log(`Listening to port: ${port}!`))
