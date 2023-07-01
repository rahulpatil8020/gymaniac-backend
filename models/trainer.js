import mongoose from "mongoose";

const trainerSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  location: { type: String },
  plans: { type: Array },
  rating: { type: Number },
  reviews: { type: Array },
  specialties: { type: Array },
});

const Trainer = mongoose.model("Trainer", trainerSchema);
export default Trainer;
