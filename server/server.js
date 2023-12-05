const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const workoutRoutes = require("./routes/workoutRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// is it normal to be able to access localhost:5000/api/exercises
// is the schema right
// figure out project structure for future ease
// what is the difference between express post and express get
// is this structure correct/make sense?
// how would i make a separate testing environment for the backend?
// how would i make a separate testing environment for the frontend?
// how do i make an environment variable for the database connection string?
// how do i split up the server.js file to account for subdirectories such as "routes", "controllers", "models", "middleware", and "services" or "utils"
// how do i separate the client and server code into different top-level directories? usually i just keep the structure that create-react-app makes for me.

// // Define an API endpoint to insert random sample data
// app.post('/api/insert-random-sample-data', (req, res) => {
//   // Define ranges for generating random data
//   const weightRange = { min: 45, max: 945 };
//   const repsRange = { min: 1, max: 10 };
//   const dateRange = 60; // Number of days from the current date
//   const rpeRange = { min: 1, max: 10 };
//   const workoutsPerExercise = 30; // Number of workouts per exercise per user

//   // Define possible notes for workouts
//   const possibleNotes = [
//     'Great workout!',
//     'Feeling strong!',
//     'Need to work on form.',
//     'Getting better every day.',
//     'Tough session but pushed through.',
//     'Felt fatigued today.',
//     'Need more rest between sets.',
//   ];

//   // Function to generate a random workout
//   const generateRandomWorkout = (user, exercise, startDate) => {
//     return {
//       user,
//       exercise,
//       weight: getRandomNumberInRange(weightRange.min, weightRange.max),
//       reps: getRandomNumberInRange(repsRange.min, repsRange.max),
//       date: startDate,
//       rpe: getRandomNumberInRange(rpeRange.min, rpeRange.max),
//       notes: getRandomElementFromArray(possibleNotes),
//     };
//   };

//   // Helper functions for generating random data
//   const getRandomNumberInRange = (min, max) => {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
//   };

//   const getRandomDateInRange = (range) => {
//     const today = new Date();
//     const randomOffset = getRandomNumberInRange(0, range);
//     today.setDate(today.getDate() - randomOffset);
//     return today;
//   };

//   const getRandomElementFromArray = (array) => {
//     return array[Math.floor(Math.random() * array.length)];
//   };

//   // For simplicity, let's assume you have an array of sample users
//   const sampleUsers = ['user1', 'user2', 'user3'];

//   // For simplicity, let's assume you have an array of sample exercises
//   const sampleExercises = [
//     'Squat',
//     'Deadlift',
//     'Bench Press',
//     // Add more sample exercises here
//   ];

//   // Generate random workouts for each user and exercise combination
//   const sampleWorkouts = [];
//   for (const user of sampleUsers) {
//     for (const exercise of sampleExercises) {
//       const startDate = getRandomDateInRange(dateRange);
//       for (let i = 0; i < workoutsPerExercise; i++) {
//         const newDate = new Date(startDate);
//         newDate.setDate(startDate.getDate() + i);
//         sampleWorkouts.push(generateRandomWorkout(user, exercise, newDate));
//       }
//     }
//   }

//   // Insert random sample workouts
//   Workout.insertMany(sampleWorkouts)
//     .then(() => {
//       res.status(201).json({ message: 'Random sample data inserted successfully' });
//     })
//     .catch((error) => {
//       res.status(500).json({ error: 'Unable to insert random sample workouts' });
//     });
// });
