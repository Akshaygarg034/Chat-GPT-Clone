import { Schema, model, models } from "mongoose";

const ChatSchema = new Schema({
  chatId: { type: String, required: true },
  userEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.Chat || model("Chat", ChatSchema);
