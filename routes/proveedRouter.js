const { faker } = require("@faker-js/faker");
const express = require("express");

const router = express.Router();
//Para query Params
router.get("/", (req, res) => {
  const { limit, offset } = req.query; //Para recoger query params por su nombre

  if ((limit, offset)) {
    res.json({
      limit,
      offset,
    });
  } else {
    res.send("NO existen parámetros");
  }
});

module.exports = router;
