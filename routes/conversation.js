import { Router } from "express";
import {
  createConversation,
  getAllConversations,
} from "../controllers/conversationController";

const router = Router();

router.get("/", getAllConversations);
router.post("/", createConversation);
