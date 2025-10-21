const { Router } = require("express");

const ticketRouter = require("./ticket");
const gamePlayRouter = require("./gameplay");

const router = Router();
router.use("/ticket", ticketRouter);
router.use("/gameplay", gamePlayRouter);

module.exports = router;
