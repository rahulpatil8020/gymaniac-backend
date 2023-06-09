import mongoose from "mongoose";
import Trainer from "../models/trainer.js";

export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.status(200).json(trainers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTrainer = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No trainer with id ${id}`);

    const trainer = await Trainer.findById(id);
    //        console.log(trainer);
    res.status(200).json(trainer);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createTrainer = async (req, res) => {
  const trainer = req.body;
  try {
    const newTrainer = new Trainer(trainer);
    await newTrainer.save();
    res.status(200).json(newTrainer);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateTrainer = async (req, res) => {
  const trainer = req.body;
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No trainer with id ${id}`);

    const updatedTrainer = await Trainer.findByIdandUpdate(id, trainer, {
      new: true,
    });
    res.status(200).json(updateTrainer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTrainer = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No trainer with id ${id}`);
    const trainer = await Trainer.findByIdAndRemove(id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.json(400).json({ message: error.message });
  }
};
