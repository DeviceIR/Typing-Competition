//get elements
const keys = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

let wpm_list = document.querySelector(".wpm-list");
const timer = document.querySelector("#init_time");
const content = document.querySelector(".content");
const my_wpm = document.getElementById("init_wpm");
const userInput = document.querySelector(".User-input");
const input = document.getElementById("clearrr");
const my_error = document.getElementById("init_errors");
const errorOverlay = document.querySelector("#error");
const errorOverlayText = document.querySelector(".overlay__text--error");

const BASE_URL = "http://localhost:4000";

content.innerText = "Focus".toUpperCase();

const user_Records = JSON.parse(localStorage.getItem("players") || "[]");

const ticketId = prompt("enter ur ticket.");
if (ticketId) login();

//definitions
let wpmNumber = 0;
let time_limit = 5;
let sum = 0;
let counterChar = 0;
let counterWord = 0;
let errorCounter = 0;
let passed_word_counter = 0;
let avg = 0;
let current_char = "";
let current_word = "";
let next_word = "";
let myUser = "";
let userName = "";
let gameplayId;
let words = [];
let user;

async function login() {
  try {
    const response = await axios.get(
      `${BASE_URL}/ticket/login?ticketId=${ticketId}`
    );
    user = response.data.data.ticket.user;
    words = response.data.data.gameplay.words;
    gameplayId = response.data.data.gameplay._id;
  } catch (error) {
    errorOverlayText.innerText = error.response.data.message;
    errorOverlay.classList.remove("hidden");
  }
}

function closeError() {
  errorOverlay.classList.add("hidden");
}

userInput.oninput = check_key();
userInput.onfocus = startGame();

function time() {
  timer.innerText = time_limit;
  const timerInterval = window.setInterval(() => {
    console.log(timer.innerText, parseInt(timer.innerText));
    time = parseInt(timer.innerText) - 1;
    timer.innerText = `${time}s`;

    if (time === 0) {
      document.querySelector(".wpm-list").classList.remove("hidden");
      wpm();
      clearInterval(timerInterval);
    }
  }, 1000);
}

function wpm() {
  // Calculate wpm formula
  wpmNumber =
    ((passed_word_counter - 1 - errorCounter / 3) / time_limit) * 10000;
  wpmNumber = Math.round(wpmNumber) * 0.01;

  //save new wpm array element for current user
  myUser.addWpm(wpmNumber);

  // show wpm on element
  my_wpm.innerText = `${wpmNumber}%`;
  user_Records.push(myUser);

  //save it to locale storage
  localStorage.setItem("players", JSON.stringify(user_Records));
  update_players_list();
}

function update_players_list() {
  myUser.wpm.forEach((wpm_rec) => {
    wpm_list.insertAdjacentText(
      "afterbegin",
      `<p class="user-wpm-list">${myUser.name} has ${wpm_rec}% wpm</p>`
    );
  });
}

function reset() {
  content.textContent = "Stay Focused";
  content.classList.add("centered");
  for (const key of keys) {
    if (key.toLowerCase() == current_char.toLowerCase()) {
      const truekey = document.getElementById(key);
      truekey.classList.remove("selected");
      counterWord = 0;
      counterChar = 0;
    }
  }

  my_wpm.innerText = 0;
  input.value = "";
  my_error.innerText = 0;
}

function updateChar() {
  if (current_word.innerHTML.charAt(counterChar) != "") {
    current_char = current_word.innerHTML.charAt(counterChar);
    targetKey();
    counterChar++;
  } else if (current_word.innerHTML.charAt(counterChar) != " ") {
    content.children[counterWord].classList.add("completed"); //better way found :D
    counterChar = 0;
    updateWord(true);
  }
}

function updateWord(remove) {
  if (remove) {
    content.removeChild(content.children[0]);
    const newChild = document.createElement("span");
    newChild.innerText = "test";
    content.appendChild(newChild);
  }
  const input = document.getElementById("clearrr");
  input.value = "";
  current_word = content.children[counterWord];
  next_word = content.children[counterWord + 1];
  current_word.classList.add("bolded");
  next_word.classList.add("semi-bold");
  passed_word_counter++;
  updateChar();
}

function targetKey() {
  for (const key in keys) {
    if (keys[key].toLowerCase() == current_char.toLowerCase()) {
      const truekey = document.getElementById(keys[key]);
      truekey.classList.add("selected");
    }
  }
}

// function getTimestamp() {
//   return Math.floor(Date.now() / 1000);
// }

function setContent() {
  content.classList.remove("centered");
  content.classList.add("percent");
  content.textContent = null;
  current_content =
    "The bikers rode down the long and narrow path to reach the city park. When they reached a good spot to rest, they began to look for signs of spring. The sun was bright, and a lot of bright red and blue blooms proved to all that warm spring days were the very best. Spring rides were planned. They had a burger at the lake and then rode farther up the mountain. As one rider started to get off his bike, he slipped and fell. One of the other bikers saw him fall but could do nothing to help him. Neither the boy nor the bike got hurt. After a brief stop, everyone was ready to go on. All the bikers enjoyed the nice view when they came to the top. All the roads far below them looked like ribbons. A dozen or so boats could be seen on the lake. It was very quiet and peaceful and no one wished to leave. As they set out on their return, they all enjoyed the ease of pedaling. The bikers came upon a new bike trail. This route led to scenery far grander than that seen from the normal path. The end of the day brought laughs and cheers from everyone. The fact that each player was very, very tired did not keep anyone from eagerly planning for the exciting ride to come.";
  // current_content =
  //   "is am, erfan labratory as it is some known, is dummy text used in goal out print, graphic or web designs. The passage";
  const clearContent = current_content.replace(/(\d)[\s.]+(?=\d)/g, "$1");

  current_content.split(/[ ,.]+/).forEach((char) => {
    const charSpan = document.createElement("span");
    charSpan.innerText = char;
    content.appendChild(charSpan);
  });
}

document.addEventListener("keyup", (event) => {
  console.log(`${event.key}'s code is : ${event.keyCode}`);
  const keyPressed = String.fromCharCode(event.keyCode).toUpperCase();
  const keyElement = document.getElementById(keyPressed);
  const highlightedKey = document.querySelector(".selected");

  keyElement.classList.add("hit");
  keyElement.addEventListener("animationend", () => {
    keyElement.classList.remove("hit");
  });

  if (keyPressed === highlightedKey.innerHTML) {
    highlightedKey.classList.remove("selected");
    updateChar();
  } else {
    const input = document.getElementById("clearrr");
    input.value = "";
    errorCounter++;
    const errors = document.getElementById("init_errors");
    errors.innerText = `${errorCounter}`;
    console.log(`er:${errors.innerText}`);
  }
});

function check_key() {}

function startGame() {
  content.classList.add(".contentapear");
  reset();
  setContent();
  time();
  updateWord();
  // targetKey();
  // targetRandomKey();
}

// document.querySelector("#game").classList.toggle("hidden");
