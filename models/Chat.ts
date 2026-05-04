import { Schema, model, models } from "mongoose";

const ChatSchema = new Schema({
  userEmail: { type: String, required: true, index: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.Chat || model("Chat", ChatSchema);
