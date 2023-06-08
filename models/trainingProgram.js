import mongoose from "mongoose";

const trainingProgramSchema = mongoose.Schema({
  trainer: { type: String, required: true },
  duration: { type: String, required: true },
  cost: { type: Number, required: true },
  details: { type: Array, required: true },
  rating: { type: Number },
  reviews: { type: Array },
});

const TrainingProgram = mongoose.model(
  "TrainingProgram",
  trainingProgramSchema
);
export default TrainingProgram;
