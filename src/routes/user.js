const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");

const router = express.Router();

router.get("/user/requests", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const requests = await ConnectionRequest.find({
      receiverId: user._id,
      status: "interested",
    }).populate("senderId", "firstName lastName age gender about skills");

    res.json({
      message: "Data fetched successfully",
      data: requests,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { receiverId: user._id, status: "accepted" },
        { senderId: user._id, status: "accepted" },
      ],
    })
      .populate("senderId", "firstName lastName age")
      .populate("receiverId", "firstName lastName age");

    const data = connections.map((connection) => {
      if (connection.senderId._id.toString() === user._id.toString()) {
        return connection.receiverId;
      }
      return connection.senderId;
    });

    res.json({
      message: "Data fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/user/feed", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    limit = limit > 50 ? 50 : limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ receiverId: user._id }, { senderId: user._id }],
    }).select("senderId receiverId status");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hideUsersFromFeed.add(request.senderId.toString());
      hideUsersFromFeed.add(request.receiverId.toString());
    });

    // Can also be written as
    // const users = await User.find({
    //   $and: [
    //     { _id: { $nin: Array.from(hideUsersFromFeed) } },
    //     { _id: { $ne: user._id } },
    //   ],
    // }).select("firstName lastName age");

    const users = await User.find({
      _id: { $nin: [...hideUsersFromFeed, user._id] },
    })
      .select("firstName lastName age skills gender photoUrl about")
      .skip(skip)
      .limit(limit);

    res.json({
      message: "Data fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
