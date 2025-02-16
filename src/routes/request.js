
const express = require("express");

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");

const router = express.Router();

router.get("/request/send/:status/:receiverId",  userAuth, async (req, res) => {
    try {
      const user = req.user;
      const senderId = user._id;
      const receiver = await User.findById(req.params?.receiverId);
      const status = req.params?.status;
      const allowedStatus = new Set(["interested", "ignored"]);

      if (!user) {
        throw new Error("User does not exist");
      }

      if (!receiver) {
        throw new Error("Receiver ID not found");
      }

      if (!status) {
        throw new Error("Status is required");
      }

      if (!allowedStatus.has(status)) {
        throw new Error("Invalid status");
      }

      // More Validations are handled in pre in connectionRequests.js
      const connectionRequest = new ConnectionRequest({
        senderId,
        receiverId: receiver._id,
        status,
      });

      const data = await connectionRequest.save();

      let message = "";
      if (status === "interested") {
        message = `${user.firstName} is interested in ${receiver.firstName}`;
      } else {
        message = `${user.firstName} is not interested in ${receiver.firstName}`;
      }
      res.json({
        message,
        data,
      })
    } catch (err) {
      res.status(400).send(err.message);
    }
  })

  module.exports = router;