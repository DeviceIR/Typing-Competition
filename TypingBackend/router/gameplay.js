const { Router } = require("express");

const controller = require("../controller/gameplay");

const router = Router();

router.put("/start", controller.putStart);
router.post("/send-word", controller.postSendWord);
router.put("/end", controller.putEnd);
router.get("/wpm", controller.getWpm);
router.get("/scoreboard", controller.getScoreboard);

module.exports = router;
