const BASE_URL = "http://localhost:4000";

const soldTickets = document.getElementById("sold-tickets");
const usedTickets = document.getElementById("used-tickets");
const joinedPlayers = document.getElementById("joined-players");
const scoreboard = document.getElementById("scoreboard");

async function update() {
  try {
    const { data: res } = await axios({
      method: "get",
      url: `${BASE_URL}/gameplay/scoreboard`,
    });
    soldTickets.innerText = res.data.soldTickets;
    usedTickets.innerText = res.data.playedTickets;
    joinedPlayers.innerText = res.data.players;

    const bestPlayers = res.data.bestPlayers;
    scoreboard.innerText = "";
    for (let i = 1; i <= bestPlayers.length; i++) {
      const player = bestPlayers[i - 1];
      const el = createPlayerEntry(player, i);
      scoreboard.appendChild(el);
    }
    for (let i = bestPlayers.length + 1; i <= 10; i++) {
      const el = createEmptyEntry(i);
      scoreboard.appendChild(el);
    }
  } catch (err) {
    console.log(err);
  }
}

function createPlayerEntry(player, pos) {
  const { user, wpm, accuracy } = player;

  const root = document.createElement("li");
  root.classList.add("ranking");

  const playerName = document.createElement("div");
  playerName.classList.add("player-name-container");

  const rank = document.createElement("div");
  rank.classList.add("rank");
  for (let digit of Array.from(`${pos}`)) {
    const digitEl = document.createElement("i");
    digitEl.classList.add("fa-solid");
    digitEl.classList.add(`fa-${digit}`);

    rank.appendChild(digitEl);
  }

  const name = document.createElement("p");
  name.classList.add("player-name");
  name.innerText = user.nickName || `${user.firstName} ${user.lastName}`;

  const dataEl = document.createElement("div");
  dataEl.classList.add("player-data");

  const wpmEl = document.createElement("p");
  wpmEl.classList.add("player-wpm");
  wpmEl.innerText = Math.round(wpm * 100) / 100 || 0;
  const accuracyEl = document.createElement("p");
  accuracyEl.classList.add("player-accuracy");
  accuracyEl.innerText = (Math.round(accuracy * 100) / 100 || 0) + "%";

  playerName.appendChild(rank);
  playerName.appendChild(name);
  dataEl.appendChild(wpmEl);
  dataEl.appendChild(accuracyEl);
  root.appendChild(playerName);
  root.appendChild(dataEl);

  return root;
}

function createEmptyEntry(pos) {
  const root = document.createElement("li");
  root.classList.add("ranking");
  const playerName = document.createElement("div");
  playerName.classList.add("player-name-container");

  const rank = document.createElement("div");
  rank.classList.add("rank");
  for (let digit of Array.from(`${pos}`)) {
    const digitEl = document.createElement("i");
    digitEl.classList.add("fa-solid");
    digitEl.classList.add(`fa-${digit}`);

    rank.appendChild(digitEl);
  }

  const name = document.createElement("p");
  name.classList.add("player-name");
  name.innerText = "We are waiting for you...";

  const dataEl = document.createElement("div");
  dataEl.classList.add("player-data");

  const wpmEl = document.createElement("p");
  wpmEl.classList.add("player-wpm");
  wpmEl.innerText = 0;
  const accuracyEl = document.createElement("p");
  accuracyEl.classList.add("player-accuracy");
  accuracyEl.innerText = 0 + "%";

  playerName.appendChild(rank);
  playerName.appendChild(name);
  dataEl.appendChild(wpmEl);
  dataEl.appendChild(accuracyEl);
  root.appendChild(playerName);
  root.appendChild(dataEl);

  root.style.borderBottomStyle = "dashed";
  root.style.borderLeftStyle = "dashed";

  return root;
}

setInterval(update, 2000);
