const { Router } = require("express");

const controller = require("../controller/ticket");

const router = Router();

router.get("/login", controller.getLogin);
router.post(
  "/generate-ticket/a3a6f02e907a11eeb9d10242ac120002/ac30e150907a11eeb9d10242ac120002",
  controller.postGenerateTicket
);
router.put(
  "/invalidate-ticket/a3a6f02e907a11eeb9d10242ac120002/ac30e150907a11eeb9d10242ac120002",
  controller.putInvalidateTicket
);

module.exports = router;
