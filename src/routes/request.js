
const express = require("express");

const { userAuth } = require("../middlewares/auth");

const router = express.Router();

router.get("/sendConnectionRequest",userAuth, async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        throw new Error("User does not exist");
      }
      res.send(user.firstName + " sent a connection request");
    } catch (err) {
      res.status(400).send(err.message);
    }
  })

  module.exports = router;