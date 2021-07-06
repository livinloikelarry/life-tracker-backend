const express = require("express");
// import the model
const Exercise = require("../models/exercise");
const security = require("../middleware/security");
const router = express.Router();

// take the router and define a bunch of endpoints on it
router.post("/", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    // log a new activity
    const { user } = res.locals;
    const exercise = await Exercise.addExercise({ user, exercise: req.body });
    return res.status(201).json({ exercise });
  } catch (err) {
    next(err);
  }
});

router.get("/", security.requireAuthenticatedUser, async (req, res, next) => {
  try {
    const { user } = res.locals;
    // show all previously added exercises
    const exercises = await Exercise.listAllExercise({ user });
    return res.status(200).json({ exercises });
  } catch (err) {
    next(err);
  }
});

router.get("/:exerciseId", async (req, res, next) => {
  try {
    // look up a single exercise by id
    const { user } = res.locals;
    const { exerciseId } = req.params;
    console.log("EXERCISE ID IS", exerciseId);
    const exercise = await Exercise.lookupExerciseById({ user }, exerciseId);
    return res.status(200).json({ exercise });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
