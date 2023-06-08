import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
  conversationId: { type: String, required: true },
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, required: true, default: new Date() },
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
