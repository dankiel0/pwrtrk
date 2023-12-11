const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Middleware to hash password before saving
userSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);
  }
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        return reject(err);
      }
      resolve(isMatch);
    });
  });
};

module.exports = mongoose.model("User", userSchema);
