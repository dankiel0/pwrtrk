const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming JSON data
app.use(bodyParser.json());

// Connect to MongoDB (replace 'your-mongodb-uri' with your MongoDB connection string)
mongoose.connect('mongodb+srv://dankiel:FWSTFZZRCpaa72pH@prwtrk.eahtso9.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for the User model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  exercises: { type: [String], default: [] }, // Store user's exercises as an array
});

// Create a User model based on the schema
const User = mongoose.model('User', userSchema);

// Define a schema for the Workout model
const workoutSchema = new mongoose.Schema({
  user: { type: String, required: true },
  exercise: { type: String, required: true },
  weight: { type: Number, required: true },
  reps: { type: Number, required: true },
  date: { type: Date, required: true },
  rpe: { type: Number, required: true },
  notes: { type: String, default: '' },
});

// Create a Workout model based on the schema
const Workout = mongoose.model('Workout', workoutSchema);

// Define an API endpoint for user registration
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  // Create a new user document and save it to the database
  const newUser = new User({ username, password });
  newUser.save()
    .then(() => {
      res.status(201).json({ message: 'User registered successfully' });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Unable to register user' });
    });
});

// Define an API endpoint for user login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user in the database
  User.findOne({ username, password })
    .then((user) => {
      if (user) {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid username or password' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Unable to login' });
    });
});

// Define an API endpoint to get the list of exercises
app.get('/api/exercises', (req, res) => {
  // You can modify this array or fetch the exercises from a database
  const exercises = [
    "Squat",
    "Deadlift",
    "Bench Press",
    "Shoulder Press",
    "Pull-Ups",
    "Push-Ups",
    "Dumbbell Rows",
    "Leg Press",
    "Lunges",
    "Bicep Curls",
    "Tricep Extensions",
    "Plank",
    "Crunches",
    "Russian Twists",
    "Leg Curls",
    "Leg Extensions",
    "Dips",
    "Chest Flyes",
    "Seated Rows",
    "Lat Pulldowns",
    "Arnold Press",
    "Hammer Curls",
    "Incline Bench Press",
    "Calf Raises",
    "Glute Bridges",
    "Reverse Lunges",
    "Bent Over Rows",
    "Side Raises",
    "Cable Curls",
    "Skull Crushers",
    "Box Jumps",
    "Romanian Deadlifts",
    "Decline Bench Press",
    "Tricep Dips",
    "Front Squats",
    "Barbell Rows",
    "Close Grip Bench Press",
    "Preacher Curls",
    "Single-Leg Deadlifts",
    "Upright Rows",
    "Kettlebell Swings",
    "Side Plank",
    "Leg Raises",
    "Dumbbell Flyes",
    "Barbell Curls",
    "Lateral Lunges",
    "Chin-Ups",
    "Seated Shoulder Press",
    "Seated Calf Raises",
    "Dumbbell Pullovers",
    "Step-Ups",
    "Russian Deadlifts",
    "Cable Rows",
    "Concentration Curls",
    "Bench Dips",
    "Good Mornings",
    "Face Pulls",
    "Cable Crossovers",
    "Leg Raises on Dip Bars",
    "Incline Dumbbell Press",
    "Lateral Raises",
    "Leg Adductions",
    "Bulgarian Split Squats",
    "Barbell Shrugs",
    "Cable Crunches",
    "Hip Thrusts",
    "Farmers Walk",
    "Arnold Dumbbell Press",
    "Plank with Leg Lift",
    "Decline Dumbbell Flyes",
    "Roman Chair Leg Raises",
    "Incline Dumbbell Curls",
    "Reverse Grip Pulldowns",
    "Barbell Lunges",
    "Cable Rope Hammer Curls",
    "Smith Machine Squats",
    "Weighted Dips",
    "Cable Leg Curls",
    "Seated Incline Bench Press",
    "Cable Face Pulls",
    "Hammer Strength Chest Press",
    "Cable Tricep Pushdowns",
    "Hack Squats",
    "Pec Flyes",
    "Reverse Flyes",
    "Barbell Wrist Curls",
    "Reverse Grip Bench Press",
    "Dumbbell Lunges",
    "Weighted Crunches",
    "Dumbbell Pullovers on Stability Ball",
    "Push Press",
    "Cable Crunches on Knees",
    "EZ Bar Curls",
    "Weighted Push-Ups",
    "Knee Raises",
    "Decline Dumbbell Bench Press",
    "Dumbbell Hammer Curls",
    "Cable Bent Over Rows",
    "Close Grip Lat Pulldowns",
    "Single-Arm Dumbbell Rows"
  ];

  res.json(exercises);
});

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

// Define an API endpoint for creating a new workout
app.post('/api/workouts', (req, res) => {
  const { user, exercise, weight, reps, date, rpe, notes } = req.body;

  // Find the user in the database based on the username
  User.findOne({ username: user })
    .then((foundUser) => {
      if (!foundUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Create a new workout document and save it to the database
      const newWorkout = new Workout({
        user: foundUser.username,
        exercise,
        weight,
        reps,
        date, // Use the parsed Date object
        rpe,
        notes,
      });

      newWorkout.save()
        .then(() => {
          res.status(201).json({ message: 'Workout created successfully' });
        })
        .catch((error) => {
          res.status(500).json({ error: 'Unable to create workout' });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Unable to retrieve user data' });
    });
});

app.get('/api/workouts/:username/:exercise', (req, res) => {
  const { username, exercise } = req.params;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Fetch workouts for the found user and exercise and send them in the response
      Workout.find({ user: user.username, exercise })
        .then((workouts) => {
          res.status(200).json(workouts);
        })
        .catch((error) => {
          res.status(500).json({ error: 'Unable to retrieve workout data' });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Unable to retrieve user data' });
    });
});

app.get('/api/users/:username', (req, res) => {
  const username = req.params.username;

  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Unable to retrieve user data' });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
