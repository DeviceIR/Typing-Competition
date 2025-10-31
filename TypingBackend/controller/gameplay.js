const GamePlay = require("../model/GamePlay");
const User = require("../model/User");
const Ticket = require("../model/Ticket");
const { calculateWpm } = require("../utils");

const START_DELAY = 5_000;
const DURATION = 60_000;

exports.putStart = async (req, res) => {
  const { id } = req.body;

  const gameplay = await GamePlay.findById(id);

  if (!gameplay) {
    return res.status(404).json({ message: "Gameplay not found" });
  }

  if (gameplay.isPlaying) {
    return res.status(409).json({ messgae: "Gameplay has been started" });
  }

  const startTime = new Date(+new Date() + START_DELAY);

  await GamePlay.updateOne({ _id: id }, { isPlaying: true, startTime });

  res
    .status(200)
    .json({ message: "Game will start soon", data: { startTime } });
};

exports.postSendWord = async (req, res) => {
  const { id, enteredWord } = req.body;
  const gameplay = await GamePlay.findById(id);
  if (!gameplay) {
    return res.status(404).json({ message: "Gameplay not found" });
  }

  if (!gameplay.startTime || +gameplay.startTime > +new Date()) {
    return res.status(403).json({ message: "Game is not started yet" });
  }

  if (+gameplay.startTime + DURATION < +new Date()) {
    return res
      .status(403)
      .json({ message: "Game has been ended. Better luck next time :)" });
  }

  if (gameplay.words.length == gameplay.inputs.length) {
    return res.status(409).json({
      message: "You already entered all the words. Better luck next time :)",
    });
  }

  await GamePlay.updateOne(
    { _id: id },
    { $push: { inputs: { word: enteredWord, enteredTime: new Date() } } }
  );

  res.status(200).json({ message: "Word saved" });
};

exports.getWpm = async (req, res) => {
  const { id } = req.query;

  const gameplay = await GamePlay.findById(id);
  if (!gameplay) {
    return res.status(403).json({ message: "Gameplay not found" });
  }

  if (!gameplay.startTime || +gameplay.startTime > +new Date()) {
    return res.status(403).json({ message: "Game is not started yet" });
  }

  if (!gameplay.wpm && gameplay.wpm !== 0) {
    return res.status(409).json({ message: "Please end the game first" });
  }

  const { wpm, accuracy } = gameplay;

  res.status(200).json({
    message: "Success",
    data: { wpm, accuracy },
  });
};

exports.getScoreboard = async (req, res) => {
  const soldTickets = await Ticket.countDocuments();
  const playedTickets = await Ticket.countDocuments({ isUsed: true });

  const players = await User.countDocuments();

  const bestPlayers = await GamePlay.aggregate([
    { $sort: { wpm: -1, accuracy: -1 } },
    { $group: { _id: "$user", gameplay: { $first: "$$ROOT" } } },
    { $replaceRoot: { newRoot: "$gameplay" } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 1,
        wpm: 1,
        accuracy: 1,
        user: { firstName: 1, lastName: 1, nickName: 1, image: 1 },
      },
    },
    { $sort: { wpm: -1, accuracy: -1 } },
  ]);

  return res.status(200).json({
    message: "Scoreboard fetched",
    data: { soldTickets, playedTickets, players, bestPlayers },
  });
};

exports.putEnd = async (req, res) => {
  const { id } = req.body;

  const gameplay = await GamePlay.findById(id);

  if (!gameplay) {
    return res.status(403).json({ message: "Gameplay not found" });
  }

  if (!gameplay.startTime || +gameplay.startTime > +new Date()) {
    return res.status(403).json({ message: "Game is not started yet" });
  }

  const lastWordTime =
    gameplay.inputs[gameplay.inputs.length - 1]?.enteredTime || new Date();
  const startTime = gameplay.startTime;

  const duration = (+lastWordTime - +startTime) / 60_000;

  const [wpm, accuracy] = calculateWpm(
    gameplay.words,
    gameplay.inputs.map((item) => item.word),
    duration
  );

  await GamePlay.updateOne({ _id: id }, { wpm, accuracy });

  return res.status(200).json({ message: "Game Ended!" });
};
