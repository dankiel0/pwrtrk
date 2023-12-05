const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workoutController");
const auth = require("../middleware/auth");

router.post("/", auth, workoutController.createWorkout);
router.get(
  "/:username/:exercise",
  auth,
  workoutController.getWorkoutsByUserAndExercise
);

module.exports = router;
