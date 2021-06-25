const express = require("express");
const router = express.Router();

// take the router and define a bunch of endpoints on it
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.login(req.body);
    return res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
