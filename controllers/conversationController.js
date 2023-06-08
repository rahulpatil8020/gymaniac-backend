import Conversation from "../models/conversation.js";

export const getAllConversations = async (req, res) => {
  const { userId } = req.body;
  const conversations = await Conversation.find({ members: { $in: [userId] } });
  res.status(200).json(conversations);
  try {
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createConversation = async (req, res) => {
  const { sender, receiver } = req.body;
  try {
    const newConversation = new Conversation({ members: [sender, receiver] });
    await newConversation.save();
    res.status(200).json(newConversation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
