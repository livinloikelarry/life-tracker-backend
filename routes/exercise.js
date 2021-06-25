const express = require("express");
const router = express.Router();

// take the router and define a bunch of endpoints on it
router.post("/exercise", async (req, res, next) => {
  try {
    // log a new activity
  } catch (err) {
    next(err);
  }
});

router.get("/exercise", async (req, res, next) => {
  try {
    // show all previously added exercises
  } catch (err) {
    next(err);
  }
});

router.get("/:exerciseId", async (req, res, next) => {
  try {
    // look up a single exercise by id
  } catch (err) {
    next(err);
  }
});

module.exports = router;
