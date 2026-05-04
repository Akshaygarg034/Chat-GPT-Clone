import { Schema, model, models } from "mongoose";

const MessageSchema = new Schema({
  userEmail: { type: String, required: true },
  chatId: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  user: {
    _id: String,
    name: String,
  },
});

// Compound index for the most common query pattern
MessageSchema.index({ userEmail: 1, chatId: 1, createdAt: 1 });

export default models.Message || model("Message", MessageSchema);
