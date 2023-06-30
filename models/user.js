const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  location: { type: String },
  friends: { type: Array },
  level: { type: String, required: true },
  workoutPlans: { type: Array },
  currentWorkoutPlan: { type: String },
  role: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
