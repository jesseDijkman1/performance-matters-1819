# Performance Matters @cmda-minor-web · 2018-2019
### Jesse Dijkman

## Intro
For this course we're going to improve the performance of the apps we created for the previous project. 

## Table of Contents
- Getting started
  - Installation
  - Running
- To-Do
- Process
  - Week 1
  - Week 2
  - Week 3


## Getting Started
### Installation
- `git@github.com:jesseDijkman1/performance-matters-1819.git`
- `cd performance-matters-1819`
- `npm install`

### Running
`npm start`

---

## To-Do
For this course I'm not only going to focus on performance but also accessibility. To make the app more accessible I'm going to render everything on the server so the user always gets HTML, so they can use the website even without JavaScript and CSS. And I'm going to use correct HTML so the user could use it with a screenreader.

---

## Process
### Week 1
In week 1 I focussed on making the app server-sided. So everything needed to be rendered on the server. So no client-side javascript fetch requests. And no DOM manipulation. But to actually make it server-sided I had to change so many things about code, which was all spaghetti (because it was written in 5 days). So I just started from scratch (which I don't recommend, but I have the habit of doing it). To make the app server-sided it immediately created some challenges like:
- How am I going to let users add words and genres
- How am I going to let users search for books

Because these two things we're all done with fancy JavaScripts, like letting users search by holding down the main potion with their cursor (which creates an animation).

To let users add words and genres, I used `<input type="hidden">`. For storing previous entered values. And with the combination of EJS it worked.

```ejs
<form class="form-word add" method="POST" action="/submitWord">
  <input name="wordsBundle" type="hidden" value="<%= words %>">
  <input name="genresBundle" type="hidden" value="<%= genres[0] %>">
  <label for="wordAdd" class="visuallyhidden">Voeg een woord toe</label>
  <input id="wordAdd" name="dataWord" type="text">
  <button type="submit">Voeg toe</button>
</form>
```

And with some CSS I eventually looked close to the original.
![After making it accessible](readme-images/screenshot-made-accessible-homepage.png)
> Look of the app after fixing server rendering

And looking at the audits for this stage, I think it worked
![Audits results after making it accessible](readme-images/screenshot-made-accessible-audits.png)


### Week 2
### Week 3
