"use strict";
import { allLevels } from './allLevels.js';
const output = document.getElementById("output");
const closeRes = document.getElementById("close");
const wood = document.getElementById("wood");
const stone = document.getElementById("stone");
const metal = document.getElementById("metal");
const amethyst = document.getElementById("amethyst");
const ice = document.getElementById("ice");
const gen = document.getElementById("gen");
const slide = document.getElementById('slide');
const view = document.getElementById('view');
const del = document.getElementById('del');
const copy = document.getElementById('copy');
!localStorage.getItem('levels') && localStorage.setItem('levels', JSON.stringify(allLevels));
const matArr = ["wood", "stone", "metal", "amethyst", "ice"];

const matName = [wood, stone, metal, amethyst, ice];

for (let i = 0; i < matName.length; i++) {
  matName[i].addEventListener("click", () => {
    SELECT([matArr[i], matName[i]]);
  });
}
const finalItem = [];
const active = [];
const selArr = [];

const SELECT = e => {
  if (e[1].classList.contains("is-open")) {
    active[0].style.border = "3px solid white";
    active[0].classList.toggle("is-open");
    active.splice(0, 1);
    selArr.splice(0, 1);
  } else if (active.length !== 0) {
    active[0].style.border = "3px solid white";
    active[0].classList.toggle("is-open");
    active.splice(0, 1);
    selArr.splice(0, 1);
    active.push(e[1]);
    selArr.push(e[0]);
    e[1].style.border = "5px solid red";
    e[1].classList.toggle("is-open");
  } else {
    active.push(e[1]);
    selArr.push(e[0]);
    e[1].style.border = "5px solid red";
    e[1].classList.toggle("is-open");
  }
};
const ATTACH = (mat, item) => {
  if (selArr.length === 0) {
    return;
  }
  if (item.classList.contains(mat)) {
    finalItem.splice(finalItem.indexOf(item), 1);
    item.classList.remove(mat);
  } else {
    if (!finalItem.includes(item)) {
      finalItem.push(item);
    }
    item.classList.add(mat);
    for (let i = 0; i < matArr.length; i++) {
      if (matArr[i] === mat) {
        continue;
      }
      item.classList.remove(matArr[i]);
    } //remove all cl except mat
  }
};
const SET_STAGE = () => {
  const WORD_GRID = document.getElementById("word-grid");
  for (let i = 0; i < 25; i++) {
    const wordDiv = document.createElement("div");
    wordDiv.classList.add("square");
    wordDiv.id = `wD${i}`;
    wordDiv.addEventListener("click", () => {
      ATTACH(selArr[0], wordDiv);
    });
    WORD_GRID.append(wordDiv);
  }
};
SET_STAGE();

let final = [];

const GENERATE = () => {
  if(!finalItem.length) return;
  const storage = JSON.parse(localStorage.getItem('levels'));
  for (let i = 0; i < finalItem.length; i++) {
    final.push(
      [finalItem[i].id, finalItem[i].classList[1]]
    );
  }
  
  storage.push({
    animPlayed: false,
    passed: false,
    level: `${storage.length + 1}`,
    stars: 0,

    backgroundGradient:`linear-gradient(${`rgb(${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )})`}, ${`rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)})`})`,

    layout: final,
    starMargins: [Math.floor(Math.random() * 20 + 30), Math.floor(Math.random() * 20 + 30)],

    difficulty: (() =>{
      let difficulty;

        const arr = [
          final.filter(e => e[1] === 'ice').length,
          final.filter(e => e[1] === 'wood').length,
          final.filter(e => e[1] === 'stone').length,
          final.filter(e => e[1] === 'amethyst').length,
          final.filter(e => e[1] === 'metal').length
        ];

        switch (arr.indexOf(Math.max(...arr))) {
          case 0:
            difficulty = 0.05;
            break;
          case 1:
            difficulty = 0.04;
            break;
          case 2:
            difficulty = 0.03;
            break;
          case 3:
            difficulty = 0.02;
            break;
          case 4:
            difficulty = 0.01;
            break;
        }
      return difficulty;
    })()
  })  
  localStorage.setItem('levels', JSON.stringify(storage));
  final = [];
};

gen.addEventListener("click", () => {
  GENERATE();
});

del.addEventListener("click", () => {
  const storage = JSON.parse(localStorage.getItem('levels'));
  storage.pop();
  localStorage.setItem('levels', JSON.stringify(storage));
});

view.addEventListener("click", () => {
  slide.style.display = 'flex';
  output.innerText = localStorage.getItem('levels');
});

copy.addEventListener("click", () => {
  output.select();
  document.execCommand('copy');
});

closeRes.addEventListener("click", () => {
  slide.style.display = "none";
  output.innerText = "";
});
