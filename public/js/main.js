"use strict";"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("../sw.js").then(e=>console.log("registered")).catch(e=>console.log(`Service worker failed: ${e}`))});const bubbles=document.querySelectorAll(".potion-bubbles .bubble");function bubbling(){for(let e=0;e<bubbles.length;e++)bubbles[e].style.animationDelay=randomTime(1,1.5,!0)}function randomTime(e,o,n){let r=Math.random()*(o-e+1)+e;return`${(r=n?-1*r:r).toFixed(2)}s`}bubbling();