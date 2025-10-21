// Containers and Overlays
const errorOverlay = document.querySelector("#error");
const loginOverlay = document.querySelector("#login-container");
const startOverlay = document.querySelector("#startGame-container");
const countdownOverlay = document.querySelector("#countdown");
const gameOverlay = document.querySelector("#game");

// Variable text elements in login phase
const errorText = document.querySelector("#error-text");
const ticketInput = document.querySelector("#login__ticket");
const usernameText = document.querySelector("#menu__username");
const countdownValue = document.querySelector("#countdown--value");

// Monitor variables
const wpmText = document.getElementById("wpm");
const elapsedTime = document.getElementById("elapsedTime");
const errors = document.getElementById("errorCount");
const accuracyText = document.getElementById("accuracy");

// IO variables
const userInput = document.getElementById("input");
const wordsContainer = document.getElementById("content");
