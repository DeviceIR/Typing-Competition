const keys = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

function initGame() {
  showWords(context.words);
  userInput.focus();

  startTimer();
  targetKey("");
}

function showWords(words) {
  const elements = words.map((word) => {
    const element = document.createElement("span");
    element.innerText = word;
    element.classList.add("content__item");

    return element;
  });

  wordsContainer.append(...elements);
}

function startTimer() {
  elapsedTime.innerText = "60s";
  const timer = setInterval(() => {
    const value = parseInt(elapsedTime.innerText) - 1;
    elapsedTime.innerText = `${value}s`;

    if (value === 0) {
      clearInterval(timer);
      gameEnded();
    }
  }, 1000);
}

async function onInput(event) {
  const letter = event.key;
  targetKey(userInput.value + letter);

  if (letter === " ") {
    word = userInput.value.trim();
    userInput.value = "";

    context.removeWord(word);
    wordsContainer.removeChild(wordsContainer.getElementsByTagName("span")[0]);

    errors.innerText = context.error;

    try {
      await axios({
        method: "post",
        url: `${BASE_URL}/gameplay/send-word`,
        data: {
          id: context.id,
          enteredWord: word,
        },
      });
    } catch (err) {
      gameEnded();
    }

    if (wordsContainer.getElementsByTagName("span").length === 0) {
      gameEnded();
    } else {
      targetKey("");
    }
  }
}

async function gameEnded() {
  userInput.readOnly = true;
  wordsContainer.innerText = "Game Over. Better luck next time";
  wordsContainer.style.backgroundColor = "inherit";

  try {
    await axios({
      method: "put",
      url: `${BASE_URL}/gameplay/end`,
      data: { id: context.id },
    });

    const { data: res } = await axios({
      method: "get",
      url: `${BASE_URL}/gameplay/wpm?id=${context.id}`,
    });

    const { wpm, accuracy } = res.data;
    wpmText.innerText = Math.round(wpm * 100) / 100;
    accuracyText.innerText = Math.round(accuracy * 100) / 100;
  } catch (err) {
    const message = err.response.data.message;
    showError(message);
  }
}

function targetKey(buffer) {
  const nextLetter = context.getNextLetter(buffer.trim());

  for (const key of keys) {
    const el = document.getElementById(key);
    el.classList.remove("selected");
    if (key.toLowerCase() == nextLetter.toLowerCase()) {
      el.classList.add("selected");
    }
  }
}
