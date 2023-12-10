const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const { username, password } = req.body;

  // Create a new user document and save it to the database
  const newUser = new User({ username, password });
  newUser
    .save()
    .then(() => {
      res.status(201).json({ message: "User registered successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Unable to register user" });
    });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // expires in 1 day
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Exclude sensitive data like password
    const userData = { username: user.username /* other user data */ };
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
