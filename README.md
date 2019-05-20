# Performance Matters @cmda-minor-web · 2018-2019
### Jesse Dijkman

For this course, we're going to enhance the performance of our earlier created [apps for the OBA (library of Amsterdam).](https://github.com/jesseDijkman1/project-1-1819).

## Process
![End product - project 1](readme-images/screenshot-project-1-homepage.png)
> Project 1 final product

To improve the performance of the oba-lab app, I felt like I needed to start from scratch. Because I created the app in just 1 week and so I wrote a lot of spaghetti. But looking at the audits I didn't see extreme issues. (see below)

![Audit test - project 1 app](readme-images/screenshot-project-1-audit.png)
> Project 1 final product audits result

---

The first thing I did was ... start from scratch. With my main focus on making everything server-sided. And to accomplish this I learned a trick from [Declan](https://github.com/decrek) to use `<input type="hidden">`. And after some styling I eventually ended up with something similar to my project 1 app. (see below)

![Server side - Oba-lab](readme-images/screenshot-made-accessible-homepage.png)
> Final look of the optimized app

The things I left out are:
- Looking by holding the main potion down with your cursor
- Droplet effect when adding a word.
- No fancy animation when adding a genre

I left most of these out because I didn't get to them, I could enhance progressively and have fallbacks, but it wasn't really important for this course.

And with this version of the app I did another audit test
![Audit test - accessible oba-lab app](readme-images/screenshot-made-accessible-audits.png)
