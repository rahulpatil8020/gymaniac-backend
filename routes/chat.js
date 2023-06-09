import { Router } from "express";
import {
  createChat,
  deleteChat,
  getAllChats,
  getConversationChats,
} from "../controllers/chatController";

const router = Router();

router.get("/", getAllChats);
router.get("/:id", getConversationChats);
router.post("/", createChat);
router.delete("/:id", deleteChat);
