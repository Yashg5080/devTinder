
const express = require("express");

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");

const router = express.Router();

router.get("/send/:status/:receiverId",  userAuth, async (req, res) => {
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

      const existingRequest = 
          await ConnectionRequest.findOne({
              $or: [
                  { senderId, receiverId: receiver._id },
                  { senderId: receiver._id, receiverId: senderId }
              ]
          })
      if (existingRequest) {
          throw new Error("Connection request already exists")
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

  router.post("/review/:status/:requestId", userAuth, async (req, res) => {
    try {
      const user = req.user;
      const {status, requestId} = req.params;
      const allowedStatus = new Set(["accepted", "rejected"]);

      if (!user) {
        throw new Error("User does not exist");
      }

      if (!status) {
        throw new Error("Status is required");
      }

      if (!allowedStatus.has(status)) {
        throw new Error("Invalid status");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        receiverId: user._id,
        status: "interested",
      })

      if (!connectionRequest) {
        throw new Error("Invalid request ID");
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      let message = "";
      if (status === "accepted") {
        message = `You have accepted request from ${connectionRequest.senderId}`;
      } else {
        message = `You have rejected request from ${connectionRequest.senderId}`;
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