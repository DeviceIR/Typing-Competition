const jwt = require("jsonwebtoken");

const Ticket = require("../model/Ticket");
const User = require("../model/User");
const GamePlay = require("../model/GamePlay");

const { generateTicket, getRandomShit } = require("../utils");

exports.getLogin = async (req, res) => {
  const { ticketId } = req.query;

  const foundTicket = await Ticket.findOne(
    { ticketId },
    "ticketId buyTime isUsed user isValid"
  );
  if (!foundTicket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  if (foundTicket.isUsed) {
    return res.status(403).json({ message: "Ticket has already been used" });
  }

  if (!foundTicket.isValid) {
    return res
      .status(403)
      .json({ message: "Ticket has been invalidated by admin" });
  }

  const gameplay = await GamePlay.create({
    ticket: foundTicket._id,
    user: foundTicket.user,
    words: getRandomShit(),
  });

  await Ticket.updateOne({ _id: foundTicket._id }, { isUsed: true });

  await foundTicket.populate(
    "user",
    "firstName lastName image studentId nickName"
  );

  const token = jwt.sign({ ticketId, loginTime: new Date() }, "spada");

  res.status(200).json({
    message: "Logged in",
    data: {
      token,
      ticket: { ...foundTicket.toObject(), isUsed: true },
      gameplay: gameplay.toJSON(),
    },
  });
};

exports.postGenerateTicket = async (req, res) => {
  const { firstName, lastName, studentId, nickName, image, ticketCount } =
    req.body;

  let user = await User.findOne({ studentId });
  if (!user) {
    user = await User.create({
      firstName,
      lastName,
      studentId,
      nickName,
      image,
    });
  }

  const ticketIds = [];
  const dbTicketIds = [];

  for (let i = 0; i < ticketCount; i++) {
    const ticketId = generateTicket();
    const ticket = await Ticket.create({
      ticketId,
      buyTime: new Date(),
      user: user._id,
    });

    ticketIds.push(ticketId);
    dbTicketIds.push(ticket._id);
  }

  await User.updateOne(
    { _id: user._id },
    { $addToSet: { tickets: { $each: dbTicketIds } } }
  );

  return res
    .status(201)
    .json({ message: "Tickets created", data: { ticketIds } });
};

exports.putInvalidateTicket = async (req, res) => {
  const { ticketId } = req.body;

  const ticket = await Ticket.findOne({ ticketId });
  if (!ticket) {
    return res.status(404).json({ message: "Ticket not found" });
  }

  await Ticket.updateOne({ _id: ticket._id }, { isValid: false });

  res.status(200).json({ message: "Ticket invalidated" });
};
