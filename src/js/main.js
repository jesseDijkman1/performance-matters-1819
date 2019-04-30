"use strict";

if (navigator.serviceWorker) {
  console.log("service worker is supported")
}

const bubbles = document.querySelectorAll(".potion-bubbles .bubble");

function bubbling() {
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].style.animationDelay = randomTime(1, 1.5, true);
  }
}

bubbling()

function randomTime(min, max, negative) {
  let n = Math.random() * ( max - min + 1) + min;

  n = negative ? n * -1 : n;

  return `${n.toFixed(2)}s`;
}
