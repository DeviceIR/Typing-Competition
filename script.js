const BASE_URL = "http://localhost:4000";

const context = new Context();

function showError(message) {
  errorText.innerText = message;
  switch (context.state) {
    case "login":
      loginOverlay.classList.add("hidden");
      break;
    case "startGame":
      startOverlay.classList.add("hidden");
      break;
    case "game":
      gameOverlay.classList.add("hidden");
      break;
  }
  errorOverlay.classList.remove("hidden");
}

function closeError() {
  errorOverlay.classList.add("hidden");
  context.reopen();
}

async function login() {
  const ticket = ticketInput.value;
  try {
    const { data: res } = await axios.get(
      `${BASE_URL}/ticket/login?ticketId=${ticket}`
    );

    id = res.data.gameplay._id;
    user = res.data.ticket.user;
    words = res.data.gameplay.words;
    context.setState("startGame");
    context.setUser(user);
    context.setId(id);
    context.setWords(words);
  } catch (err) {
    const message = err.response.data.message;
    showError(message);
  }
}

async function startCountDown() {
  try {
    const { data: res } = await axios({
      method: "put",
      url: `${BASE_URL}/gameplay/start`,
      data: { id: context.id },
    });

    const startTime = res.data.startTime;
    context.setStartTime(startTime);
    context.setState("countdown");
    countdown();
  } catch (err) {
    const message = err.response.data.message;
    showError(message);
  }
}

async function countdown() {
  const timer = setInterval(() => {
    const value = context.getCountDown();
    countdownValue.innerText = value;
    if (value <= 0) {
      clearInterval(timer);
      context.setState("game");
      initGame();
    }
  }, 100);
}
