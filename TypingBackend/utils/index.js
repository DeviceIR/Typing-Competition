const words = require("../words.json");

let counter = 0;
let letters = "abcdefghijklmnopqrstuvwxyz";
let numbers = "0123456789";

const getRandom = (list) =>
  list.charAt(Math.floor(Math.random() * list.length));

exports.generateTicket = () => {
  const c = counter.toString().padStart(4, "0");
  const ll = getRandom(letters) + getRandom(letters);
  const n =
    getRandom(numbers) +
    getRandom(numbers) +
    getRandom(numbers) +
    getRandom(numbers);

  const ticket =
    ll + "-" + c[0] + n[0] + c[1] + n[1] + c[2] + n[2] + c[3] + n[3];
  counter++;
  return ticket;
};

exports.calculateWpm = (words, inputs, duration) => {
  const correctCount = inputs.reduce((sum, input, idx) => {
    if (words.length <= idx) return sum;
    const word = words[idx];

    if (word == input) return sum + 1;
    else return sum;
  }, 0);

  const allCount = inputs.length;

  const wpm = correctCount / duration;
  const accuracy = allCount === 0 ? 0 : (wpm / allCount) * duration * 100;

  return [wpm, accuracy];
};

exports.getRandomShit = () => {
  let arr = Array.from({ length: 326 }, (_, index) => index);
  const res = [];

  for (let i = 0; i < 256; i++) {
    const randomIdx = Math.floor(Math.random() * arr.length);
    const randomValue = arr[randomIdx];
    arr = arr.slice(0, randomIdx).concat(arr.slice(randomIdx + 1));
    res.push(randomValue);
  }

  return res.map((item) => words[item]);
};
