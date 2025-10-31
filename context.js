class Context {
  state = "login";
  user = null;
  id = null;
  startTime = null;
  words = [];
  error = 0;

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

  removeWord(input) {
    const word = this.words.shift();
    if (word !== input) this.error++;
  }

  getNextLetter(buffer) {
    const word = this.words[0];

    const arr = Array.from(buffer);
    const { found, value: letter } = arr.reduce(
      (prev, l, i) => {
        if (l === word.charAt(i)) return prev;
        if (prev.found) return prev;

        prev.found = true;
        prev.value = word.charAt(i);

        return prev;
      },
      { found: false, value: "space" }
    );
    if (!found && arr.length !== word.length) {
      return word.charAt(arr.length);
    }

    return letter;
  }
}
