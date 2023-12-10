const User = require("../models/User");
const Workout = require("../models/Workout");

exports.createWorkout = (req, res) => {
  const { username, exercise, weight, reps, date, rpe, notes } = req.body;

  // Find the user in the database based on the username
  User.findOne({ username: username })
    .then((foundUser) => {
      if (!foundUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Create a new workout document and save it to the database
      const newWorkout = new Workout({
        username: foundUser.username,
        exercise,
        weight,
        reps,
        date, // Use the parsed Date object
        rpe,
        notes,
      });

      newWorkout
        .save()
        .then(() => {
          res.status(201).json({ message: "Workout created successfully" });
        })
        .catch((error) => {
          res.status(500).json({ error: "Unable to create workout" });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: "Unable to retrieve user data" });
    });
};

exports.getWorkoutsByUserAndExercise = (req, res) => {
  const { username, exercise } = req.params;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      Workout.find({ username: user.username, exercise })
        .then((workouts) => {
          if (workouts.length === 0) {
            // No workouts found for this exercise
            return res.status(200).json({ message: "No workouts found for this exercise." });
          }
          res.status(200).json(workouts);
        })
        .catch((error) => {
          res.status(500).json({ error: "Unable to retrieve workout data" });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: "Unable to retrieve user data" });
    });
};

exports.getUser = (req, res) => {
  const username = req.params.username;

  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: "Unable to retrieve user data" });
    });
};
