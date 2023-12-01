class Context {
  state = "login";
  user = null;
  id = null;
  startTime = null;
  words = [];

  setState(state) {
    this.state = state;
    loginOverlay.classList.add("hidden");
    startOverlay.classList.add("hidden");
    countdownOverlay.classList.add("hidden");
    gameOverlay.classList.add("hidden");
    errorOverlay.classList.add("hidden");
    switch (state) {
      case "login":
        loginOverlay.classList.remove("hidden");
        break;
      case "startGame":
        startOverlay.classList.remove("hidden");
        break;
      case "countdown":
        countdownOverlay.classList.remove("hidden");
        break;
      case "game":
        gameOverlay.classList.remove("hidden");
        break;
    }
  }

  reopen() {
    this.setState(this.state);
  }

  setUser(user) {
    this.user = user;
    usernameText.innerText =
      user.nickName || `${user.firstName} ${user.lastName}`;
  }

  setId(id) {
    this.id = id;
  }

  setWords(words) {
    this.words = words;
  }

  setStartTime(startTime) {
    this.startTime = +new Date(startTime);
  }

  getCountDown() {
    return Math.round((this.startTime - +new Date()) / 1000);
  }
}
