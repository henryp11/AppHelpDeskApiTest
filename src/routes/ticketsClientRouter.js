const express = require("express");
const passport = require("passport");
const MtrTicketService = require("../services/mtrTicketService");

const router = express.Router();
const service = new MtrTicketService();

router.get(
  "/my-tickets",
  passport.authenticate("jwt", { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user; //Para extraer el sub del token
      const data = await service.findByUser(user.sub);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
