import { Router } from "express";
import {
  createTrainer,
  deleteTrainer,
  getAllTrainers,
  getTrainer,
  updateTrainer,
} from "../controllers/trainerController";

const router = Router();

router.get("/:id", getTrainer);
router.get("/", getAllTrainers);
router.post("/", createTrainer);
router.patch("/:id", updateTrainer);
router.delete("/:id", deleteTrainer);

export default router;
