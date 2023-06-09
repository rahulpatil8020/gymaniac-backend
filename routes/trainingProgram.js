import { Router } from "express";
import {
  createTrainingProgram,
  deleteTrainingProgram,
  getAllTrainingPrograms,
  getTrainingProgram,
  updateTrainingProgram,
} from "../controllers/trainingProgramController";

const router = Router();

router.get("/", getAllTrainingPrograms);
router.get("/:id", getTrainingProgram);
router.post("/", createTrainingProgram);
router.patch("/:id", updateTrainingProgram);
router.delete("/:id", deleteTrainingProgram);
