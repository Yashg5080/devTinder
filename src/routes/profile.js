const express = require('express');

const { userAuth } = require('../middlewares/auth');
const {validateEditProfileData} = require('../utils/validations');

const router = express.Router();

router.get("/view",userAuth, async (req, res) => {
  try {

    const user = req.user;
    if (!user) {
      throw new Error("User does not exist");
    }
    res.json({
      message: "User fetched successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
})

router.patch("/edit",userAuth, async (req, res) => {
  try {
    validateEditProfileData(req);

    // Current info of the user
    const user = req.user;

    // Update the user object with the new info
    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });

    await user.save();
    res.json({
      message: "Profile updated successfully",
      user,
    });

  } catch (err) {
    res.status(400).send(err.message);
  }
})

module.exports = router;