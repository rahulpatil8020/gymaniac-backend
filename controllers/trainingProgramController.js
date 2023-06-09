import mongoose from "mongoose";
import TrainingProgram from "../models/trainingProgram.js";

export const getTrainingProgram = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No training program with id ${id}`);

    const trainingProgram = await TrainingProgram.findById(id);
    res.status(200).json(trainingProgram);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllTrainingPrograms = async (req, res) => {
  try {
    const trainingPrograms = await TrainingProgram.find();
    res.status(200).json(trainingPrograms);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createTrainingProgram = async (req, res) => {
  const trainingProgram = req.body;
  try {
    const newTrainingProgram = new TrainingProgram(trainingProgram);
    await newTrainingProgram.save();
    res.status(200).json(newTrainingProgram);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateTrainingProgram = async (req, res) => {
  const trainingProgram = req.body;
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send(`No training program with id ${id}`);
    }
    const updatedTrainingProgram = await TrainingProgram.findByIdAndUpdate(
      id,
      trainingProgram,
      { new: true }
    );
    res.status(200).json(updatedTrainingProgram);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteTrainingProgram = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No training program with id ${id}`);

    const trainingProgram = await TrainingProgram.findByIdAndRemove(id);
    res.status(200).json({ message: "Training Program deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
