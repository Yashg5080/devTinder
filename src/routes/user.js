const router = require('express').Router();
const User = require('../models/user');
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequests');

router.get('/user/requests', userAuth, async (req, res) => {
  try {
    const user = req.user;

    const requests = await ConnectionRequest.find({
        receiverId: user._id,
        status: "interested"
    }).populate("senderId", "firstName lastName age gender about skills");

    res.json({
        message: "Data fetched successfully",
        data: requests
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
                {receiverId: user._id, status: "accepted"},
                {senderId: user._id, status: "accepted"}
            ]
        }).populate("senderId", "firstName lastName age")
        .populate("receiverId", "firstName lastName age");

        const data = connections.map(connection => {
            if(connection.senderId._id.toString() === user._id.toString()) {
                return connection.receiverId;
            }
            return connection.senderId;
        });

        res.json({
            message: "Data fetched successfully",
            data
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;