"use strict";

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");
const parseString = require('xml2js').parseString;
const fs = require("fs");

const port = process.env.PORT || 2000;

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
      const pattern = /^([a-z]+\,?)+[a-z]*$/im;
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
      const arr = strArray.split(",")
      const i = arr.indexOf(str);
      const x = arr.splice(i, 1).join(",")

      resolve(arr)
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

app.get("*," (req, res) => {
  res.redirect("https://" + req.headers.host + req.url);
})

app.get("/", (req, res) => {
  // Could give users the possibility to choose what section of the page they wnat to visit now just redirect to search
  res.redirect("/search/words")
})

app.get("/search", (req, res) => {
  // Could give users the possibility to choose what section of the page they wnat to visit now just redirect to search
  res.redirect("/search/words")
})

// app.get("/search", async (req, res) => {
  // const validGenres = ["humor", "sport", "stripverhaal", "sprookjes", "school"];
  // let allWords, allGenres;
  //
  // try {
  //   allWords = await checkQueryParams(req.query.words);
  //   allGenres = await checkQueryParams(req.query.genres, validGenres);
  // } catch (err) {
  //   // The given query isn't correct, do something
  //   return console.log(err)
  // }
  //
  // res.render("index.ejs", {
  //   words: allWords,
  //   genres: [allGenres, validGenres],
  //   searchUrl: req._parsedUrl.search
  // });
// })

app.get("/search/:section", async (req, res) => {
  const section = req.params.section;

  const validGenres = ["humor", "sport", "stripverhaal", "sprookjes", "school"];
  let allWords, allGenres;

  try {
    allWords = await checkQueryParams(req.query.words);
    allGenres = await checkQueryParams(req.query.genres, validGenres);
  } catch (err) {
    // The given query isn't correct, do something
    return console.log(err)
  }



    if (section == "words") {
      res.render("search-words.ejs", {
        words: allWords,
        genres: [allGenres, validGenres],
        searchUrl: req._parsedUrl.search
      });
    } else if (section == "genres") {
      res.render("search-genres.ejs", {
        words: allWords,
        genres: [allGenres, validGenres],
        searchUrl: req._parsedUrl.search
      });
    } else {
      res.render("error.ejs")
    }
      // res.render("search-words.ejs", {
      //   words: allWords,
      //   genres: [allGenres, validGenres],
      //   searchUrl: req._parsedUrl.search
      // });


  // }

  // res.render("index.ejs", {
  //   words: allWords,
  //   genres: [allGenres, validGenres],
  //   searchUrl: req._parsedUrl.search
  // });
})

app.post("/submitWord", async (req, res) => {

  const allWords = await strArrayParser(req.body.wordsBundle, req.body.dataWord);

  const allGenres = await strArrayParser(req.body.genresBundle, undefined);

  const queryParams = makeQueryParams([{words:allWords}, {genres:allGenres}]);

  res.redirect(`/search/words${queryParams}`)
})

app.post("/submitGenre", async (req, res) => {
  const allGenres = await strArrayParser(req.body.genresBundle, req.body.dataGenre);
  const allWords = await strArrayParser(req.body.wordsBundle, undefined);
  const queryParams = makeQueryParams([{words:allWords}, {genres:allGenres}]);

  res.redirect(`/search/genres${queryParams}`)
})

app.post("/removeWord", async (req, res) => {
  const allWords = await strArrayRemover(req.body.wordsBundle, req.body.dataWord)
  const allGenres = await strArrayRemover(req.body.genresBundle, undefined)
  const queryParams = makeQueryParams([{words:allWords}, {genres:allGenres}]);

  res.redirect(`/search/words${queryParams}`)
})

app.post("/removeGenre", async (req, res) => {

  const allGenres = await strArrayRemover(req.body.genresBundle, req.body.dataGenre);
  const allWords = await strArrayRemover(req.body.wordsBundle, undefined);
  const queryParams = makeQueryParams([{words:allWords}, {genres:allGenres}]);

  res.redirect(`/search/genres${queryParams}`)
})

function loader(req, res) {
  return new Promise((resolve, reject) => {
    const hasParams = Object.keys(req.query).length;

    if (!req.query.loading) {
      if (!hasParams) {
        req.url += "?loading=true";
      } else {
        req.url += "&loading=true";
      }

      // console.log(req.protocol)
      const fullUrl = `https://${req.get("host")}${req.url}`;

      res.render("loading.ejs", {callBackUrl: fullUrl})
    } else {
      resolve()
    }
  })
}



app.get("/results", async (req, res) => {
    await loader(req, res);

    fs.readFile("data/better.json", (err, data) => {
      const parsedData = JSON.parse(data);

      parsedData.aquabrowser.meta.totalPages = Math.ceil(parsedData.aquabrowser.meta.count / 20);

      res.render("list.ejs", {
        meta: parsedData.aquabrowser.meta,
        results: parsedData.aquabrowser.results.result
      });
    })
})

function findObject(data, _id) {
  return new Promise((resolve, reject) => {
    const idRx = /(?<=\|)\d+/;

    data.find(obj => {
      const id = idRx.exec(obj.id._)[0];

      if (id == _id) {
        resolve(obj)
      }
    })
  })
}


function fillInTheBlanks(data) {
  let keyStorage = [];
  data.forEach(d => {
    for (let key in d) {
      keyStorage.push(key)
    }
  })

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
// Unique keys used for every object in result
const distinctKeys = [...new Set(keyStorage)];

data.forEach(d => {
  const objKeys = Object.keys(d);

  distinctKeys.forEach(dk => {
    if (!objKeys.includes(dk)) {
      d[dk] = undefined;
    }
  })
})

return data
}

app.get("/detail/:id", async (req, res) => {
  await loader(req, res);

  fs.readFile("data/better.json", async (err, data) => {
    const id = req.params.id;
    const parsedData = JSON.parse(data).aquabrowser.results.result;
    const completeData = fillInTheBlanks(parsedData);

    const detailData = await findObject(completeData, id)
    res.render("detail.ejs", detailData)
  })
})


app.listen(port, () => console.log(`Listening to port: ${port}!`))
